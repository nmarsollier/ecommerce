package projections.orderStatus;

import java.util.List;

import org.bson.types.ObjectId;

import events.EventRepository;
import events.schema.Event;
import projections.orderStatus.schema.OrderStatus;

public class OrderStatusService {

    static OrderStatusService instance;

    public static OrderStatusService getInstance() {
        if (instance == null) {
            instance = new OrderStatusService();
        }
        return instance;
    }

    // Actualiza la proyección Order
    public void update(Event event) {
        OrderStatusRepository repository = OrderStatusRepository.getInstance();
        OrderStatus order = repository.findById(event.getOrderId());
        if (order == null) {
            order = new OrderStatus();
        }
        order.update(event);
        repository.save(order);
    }

    public OrderStatus findById(ObjectId orderId) {
        OrderStatusRepository repository = OrderStatusRepository.getInstance();
        OrderStatus order = repository.findById(orderId);
        if (order == null) {
            order = rebuildOrderStatus(orderId);
        }
        return order;
    }

    // Se elimina y regenera la proyección a partir de los eventos.
    public OrderStatus rebuildOrderStatus(ObjectId orderId) {
        List<Event> events = EventRepository.getInstance().findByOrderId(orderId);
        if (events.size() == 0) {
            return null;
        }

        OrderStatusRepository.getInstance().delete(orderId);
        OrderStatus order = new OrderStatus();
        events.forEach(ev -> {
            order.update(ev);
        });
        OrderStatusRepository.getInstance().save(order);
        return order;
    }

}