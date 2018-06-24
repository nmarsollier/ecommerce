package projections.orderStatus;

import java.util.ArrayList;
import java.util.List;

import org.bson.types.ObjectId;
import org.mongodb.morphia.query.Query;

import projections.common.Status;
import projections.orderStatus.schema.OrderStatus;
import utils.db.MongoStore;

public class OrderStatusRepository {
    private static OrderStatusRepository instance;

    private OrderStatusRepository() {

    }

    public static OrderStatusRepository getInstance() {
        if (instance == null) {
            instance = new OrderStatusRepository();
        }
        return instance;
    }

    /**
     * Devuelve una orden especifica
     */
    public OrderStatus findById(ObjectId id) {
        OrderStatus result = MongoStore.getProjectionsStore().get(OrderStatus.class, id);
        return result;
    }

    /**
     * Devuelve las ordenes de un usuario especifico
     */
    public List<OrderStatus> findByUserId(String userId) {
        Query<OrderStatus> q = MongoStore.getProjectionsStore().createQuery(OrderStatus.class);
        q.and(q.criteria("userId").equal(userId));
        q.order("created");
        ArrayList<OrderStatus> result = new ArrayList<>();
        Iterable<OrderStatus> resultList = q.fetch();
        for (OrderStatus os : resultList) {
            result.add(os);
        }

        return result;
    }

    /**
     * Devuelve las ordenes que tienen un estado en particular
     */
    public List<OrderStatus> findByStatus(Status status) {
        Query<OrderStatus> q = MongoStore.getProjectionsStore().createQuery(OrderStatus.class);
        q.and(q.criteria("status").equal(status));
        q.order("created");
        ArrayList<OrderStatus> result = new ArrayList<>();
        Iterable<OrderStatus> resultList = q.fetch();
        for (OrderStatus os : resultList) {
            result.add(os);
        }

        return result;
    }


    public void save(OrderStatus order) {
        MongoStore.getProjectionsStore().save(order);
    }

    public void delete(ObjectId orderId) {
        MongoStore.getProjectionsStore().delete(OrderStatus.class, orderId);
    }
}