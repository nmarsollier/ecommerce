package events.schema;

import java.util.Date;

import org.bson.types.ObjectId;
import org.mongodb.morphia.annotations.Entity;
import org.mongodb.morphia.annotations.Id;
import org.mongodb.morphia.annotations.Indexed;

/**
 * Permite almacenar los eventos del event store.
 */
@Entity(value = "event", noClassnameStored = true)
public class Event {
    @Id
    private ObjectId id;

    @Indexed()
    private ObjectId orderId;

    private EventType type;

    private PlaceEvent placeEvent;

    private ArticleValidationEvent articleValidationEvent;

    private PaymentEvent payment;

    private Date created = new Date();

    private Event() {
    }

    // Crea un nuevo evento de place order
    public static Event newPlaceOrder(PlaceEvent placeEvent) {
        Event result = new Event();
        result.orderId = new ObjectId();
        result.type = EventType.PLACE_ORDER;
        result.placeEvent = placeEvent;
        return result;
    }

    public static Event newArticleValidation(String orderId, ArticleValidationEvent validationEvent) {
        Event result = new Event();
        result.orderId = new ObjectId(orderId);
        result.type = EventType.ARTICLE_VALIDATION;
        result.articleValidationEvent = validationEvent;
        return result;
    }

    public static Event newPayment(String orderId, String userId, PaymentEvent.Method method, double amount) {
        Event result = new Event();
        result.orderId = new ObjectId(orderId);
        result.type = EventType.PAYMENT;
        result.payment = new PaymentEvent(userId, method, amount);
        return result;
    }

    public ObjectId getId() {
        return id;
    }

    public ObjectId getOrderId() {
        return orderId;
    }

    public EventType getType() {
        return type;
    }

    public Date getCreated() {
        return created;
    }

    public ArticleValidationEvent getArticleValidationEvent() {
        return articleValidationEvent;
    }

    public PlaceEvent getPlaceEvent() {
        return placeEvent;
    }

    public PaymentEvent getPayment() {
        return payment;
    }
}
