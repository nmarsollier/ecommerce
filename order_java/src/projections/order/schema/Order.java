package projections.order.schema;

import java.util.Arrays;
import java.util.Date;

import org.bson.types.ObjectId;
import org.mongodb.morphia.annotations.Entity;
import org.mongodb.morphia.annotations.Id;
import org.mongodb.morphia.annotations.Indexed;

import events.schema.Event;
import events.schema.PaymentEvent;
import projections.common.Status;

/**
 * Es el Agregado principal de Articulo.
 */

@Entity(value = "order_projection", noClassnameStored = true)
public final class Order {
    @Id
    ObjectId id;

    Status status;

    @Indexed()
    String userId;

    @Indexed()
    String cartId;
    Article[] articles = new Article[] {};

    Payment[] payment = new Payment[] {};

    Date updated = new Date();
    Date created = new Date();

    public Order() {
    }

    public void update(Event event) {
        OrderUpdater.getUpdaterForEvent(event.getType()).update(this, event);
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

    public Article[] getArticles() {
        return articles;
    }

    public Payment[] getPayment() {
        return payment;
    }

    public Date getCreated() {
        return created;
    }

    public Date getUpdated() {
        return updated;
    }

    public double getTotalPrice() {
        return Arrays.stream(articles).mapToDouble(a -> a.getTotalPrice()).sum();
    }

    public double getTotalPayment() {
        return Arrays.stream(payment).mapToDouble(a -> a.amount).sum();
    }


    public static class Article {
        String id;
        int quantity;
        double unitaryPrice;
        boolean valid;
        boolean validated;

        Article() {
        }

        protected Article(String id, int quantity) {
            this.id = id;
            this.quantity = quantity;
        }

        public String getId() {
            return id;
        }

        public int getQuantity() {
            return quantity;
        }

        public boolean isValid() {
            return valid;
        }

        public boolean isValidated() {
            return validated;
        }

        public double getUnitaryPrice() {
            return unitaryPrice;
        }

        public double getTotalPrice() {
            return unitaryPrice * quantity;
        }
    }

    public static class Payment {
        PaymentEvent.Method method;
        double amount;

        Payment() {
        }

        protected Payment(PaymentEvent.Method method, double amount) {
            this.method = method;
            this.amount = amount;
        }

        public double getAmount() {
            return amount;
        }

        public PaymentEvent.Method getMethod() {
            return method;
        }
    }
}
