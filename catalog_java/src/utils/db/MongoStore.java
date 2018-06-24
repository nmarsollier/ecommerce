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

    static Datastore datastore;

    public static void init() {
        final Morphia morphia = new Morphia();

        MongoClient client = new MongoClient(Environment.getEnv().databaseUrl);
        datastore = morphia.createDatastore(client, "catalog_java");
        datastore.ensureIndexes();
    }

    public static Datastore getDataStore() {
        if (datastore == null) {
            init();
        }
        return datastore;
    }

    static {
        Logger.getLogger("org.mongodb.driver").setLevel(Level.SEVERE);
        Logger.getLogger("org.mongodb.morphia").setLevel(Level.SEVERE);
    }
}