package projections.orderStatus.schema;

import java.util.Date;

import org.bson.types.ObjectId;
import org.mongodb.morphia.annotations.Entity;
import org.mongodb.morphia.annotations.Id;
import org.mongodb.morphia.annotations.Indexed;

import events.schema.Event;
import projections.common.Status;
import projections.order.schema.Order;

/**
 * Es el Agregado principal de Articulo.
 */

@Entity(value = "order_projection", noClassnameStored = true)
public final class OrderStatus {
    @Id
    ObjectId id;

    @Indexed()
    Status status;

    @Indexed()
    String userId;

    @Indexed()
    String cartId;
    int articles;

    double payment;

    double totalPrice;

    Date updated = new Date();
    Date created = new Date();

    public OrderStatus() {
    }

    public void update(Event event) {
        OrderStatusUpdater.getUpdaterForEvent(event.getType()).update(this, event);
    }

    public void update(Order order) {
        status = order.getStatus();
        totalPrice = order.getTotalPrice();
    }

    public ObjectId getId() {
        return id;
    }

    public String getCartId() {
        return cartId;
    }

    public String getUserId() {
        return userId;
    }

    public Status getStatus() {
        return status;
    }

    public int getArticles() {
        return articles;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public double getPayment() {
        return payment;
    }

    public Date getCreated() {
        return created;
    }

    public Date getUpdated() {
        return updated;
    }
}
