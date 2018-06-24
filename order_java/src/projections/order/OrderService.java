package projections.order;

import java.util.List;

import org.bson.types.ObjectId;

import events.EventRepository;
import events.schema.Event;
import projections.order.schema.Order;

public class OrderService {

    static OrderService instance;

    public static OrderService getInstance() {
        if (instance == null) {
            instance = new OrderService();
        }
        return instance;
    }

    // Se elimina y regenera la proyección a partir de los eventos.
    public Order buildOrder(ObjectId orderId) {
        List<Event> events = EventRepository.getInstance().findByOrderId(orderId);
        if (events.size() == 0) {
            return null;
        }

        Order order = new Order();
        events.forEach(ev -> {
            order.update(ev);
        });
        return order;
    }

}