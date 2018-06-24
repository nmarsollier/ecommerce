package utils.db;

import java.util.logging.Level;
import java.util.logging.Logger;

import com.mongodb.MongoClient;

import org.mongodb.morphia.Datastore;
import org.mongodb.morphia.Morphia;

import utils.server.Environment;

/**
 * Permite la configuración del acceso a la db
 */
public class MongoStore {
    static Datastore event;
    static Datastore projections;

    public static Datastore getEventStore() {
        if (event == null) {
            final Morphia morphia = new Morphia();
            event = morphia.createDatastore(new MongoClient(Environment.getEnv().databaseUrl), "order_java");
            event.ensureIndexes();
        }
        return event;
    }

    public static Datastore getProjectionsStore() {
        if (projections == null) {
            final Morphia morphia = new Morphia();
            projections = morphia.createDatastore(new MongoClient(Environment.getEnv().databaseUrl), "order_projections_java");
            projections.ensureIndexes();
        }
        return projections;
    }

    static {
        Logger.getLogger("org.mongodb.driver").setLevel(Level.SEVERE);
        Logger.getLogger("org.mongodb.morphia").setLevel(Level.SEVERE);
    }
}