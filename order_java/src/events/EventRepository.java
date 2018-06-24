package events;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.xml.bind.ValidationException;

import org.bson.types.ObjectId;
import org.mongodb.morphia.query.Query;

import events.schema.Event;
import events.schema.EventType;
import utils.db.MongoStore;

public class EventRepository {
    private static EventRepository instance;

    private EventRepository() {

    }

    public static EventRepository getInstance() {
        if (instance == null) {
            instance = new EventRepository();
        }
        return instance;
    }

    public Event save(Event event) throws ValidationException {
        MongoStore.getEventStore().save(event);
        return event;
    }

    public Event findPlaceByCartId(String cartId) {
        Query<Event> q = MongoStore.getEventStore().createQuery(Event.class);

        q.and(q.criteria("type").equal(EventType.PLACE_ORDER), q.criteria("placeEvent.cartId").equal(cartId));
        Iterator<Event> resultList = q.fetch();
        if (resultList.hasNext()) {
            return resultList.next();
        }

        return null;
    }


    public Event findPlaceByOrderId(ObjectId orderId) {
        Query<Event> q = MongoStore.getEventStore().createQuery(Event.class);

        q.and(q.criteria("type").equal(EventType.PLACE_ORDER), q.criteria("orderId").equal(orderId));
        Iterator<Event> resultList = q.fetch();
        if (resultList.hasNext()) {
            return resultList.next();
        }

        return null;
    }

    public List<Event> findByOrderId(ObjectId orderId) {
        Query<Event> q = MongoStore.getEventStore().createQuery(Event.class);

        q.and(q.criteria("orderId").equal(orderId));
        q.order("created");
        ArrayList<Event> result = new ArrayList<>();
        Iterable<Event> resultList = q.fetch();
        for (Event os : resultList) {
            result.add(os);
        }

        return result;
    }
}