package application;

import java.util.Arrays;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;

import org.bson.types.ObjectId;

import events.EventRepository;
import events.schema.Event;
import events.schema.EventType;
import projections.common.Status;
import projections.order.OrderService;
import projections.order.schema.Order;
import projections.orderStatus.OrderStatusRepository;
import projections.orderStatus.schema.OrderStatus;

public class BatchService {
    private static AtomicBoolean placeOrdersRunning = new AtomicBoolean();
    private static AtomicBoolean validatedOrdersRunning = new AtomicBoolean();

    public static void processPlacedOrders() {
        new Thread(() -> {
            if (placeOrdersRunning.compareAndSet(false, true)) {
                OrderService orderService = OrderService.getInstance();
                OrderStatusRepository statusRepository = OrderStatusRepository.getInstance();
                List<OrderStatus> placedOrders = statusRepository.findByStatus(Status.PLACED);

                placedOrders.forEach(stat -> {
                    Order order = orderService.buildOrder(stat.getId());

                    // Si status de order sigue en PLACED es porque no se validó completamente
                    if (order.getStatus() == Status.PLACED) {
                        validateOrder(order.getId());
                    } else {
                        // En este caso OrderStatus esta desactualizado
                        stat.update(order);
                        statusRepository.save(stat);
                    }
                });
                placeOrdersRunning.set(false);
            }
        }).start();
    }

    public static void processValidatedOrders() {
        new Thread(() -> {
            if (validatedOrdersRunning.compareAndSet(false, true)) {
                OrderService orderService = OrderService.getInstance();
                OrderStatusRepository statusRepository = OrderStatusRepository.getInstance();
                List<OrderStatus> placedOrders = statusRepository.findByStatus(Status.VALIDATED);

                placedOrders.forEach(stat -> {
                    Order order = orderService.buildOrder(stat.getId());
                    stat.update(order);
                    statusRepository.save(stat);
                });
                validatedOrdersRunning.set(false);
            }
        }).start();
    }

    public static void processPaymentDefinedOrders() {
        new Thread(() -> {
            if (validatedOrdersRunning.compareAndSet(false, true)) {
                OrderService orderService = OrderService.getInstance();
                OrderStatusRepository statusRepository = OrderStatusRepository.getInstance();
                List<OrderStatus> placedOrders = statusRepository.findByStatus(Status.PAYMENT_DEFINED);

                placedOrders.forEach(stat -> {
                    Order order = orderService.buildOrder(stat.getId());
                    stat.update(order);

                    if (order.getStatus() == Status.PAYMENT_DEFINED) {
                        // A reservar artículos

                    }

                    statusRepository.save(stat);
                });
                validatedOrdersRunning.set(false);
            }
        }).start();
    }

    private static void validateOrder(ObjectId orderId) {
        EventRepository repository = EventRepository.getInstance();
        Event event = repository.findPlaceByOrderId(orderId);
        if (event != null) {
            /**
            * Busca todos los artículos de un evento, los envía a rabbit para que catalog valide si están activos
            */
            new Thread(() -> {
                if (event.getType() == EventType.PLACE_ORDER) {
                    Arrays.stream(event.getPlaceEvent().getArticles()) //
                            .forEach(a -> {
                                RabbitController.sendArticleValidation(event.getOrderId().toHexString(), a.getArticleId());
                            });
                }
            }).start();
        }
    }
}