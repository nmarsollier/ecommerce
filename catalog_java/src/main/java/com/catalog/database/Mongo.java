package com.catalog.database;

import com.mongodb.MongoClient;

import org.mongodb.morphia.Datastore;
import org.mongodb.morphia.Morphia;

public class Mongo {
    static Mongo mongo;

    final Morphia morphia = new Morphia();
    Datastore datastore;

    private Mongo() {
        // tell Morphia where to find your classes
        // can be called multiple times with different packages or classes
        morphia.mapPackage("org.catalog.articles");

        // create the Datastore connecting to the default port on the local host
        datastore = morphia.createDatastore(new MongoClient(), "catalog_java");
        datastore.ensureIndexes();
    }

    public static Mongo getInstance() {
        if (mongo == null) {
            mongo = new Mongo();
        }
        return mongo;
    }

    /**
     * @return the datastore
     */
    public Datastore getDatastore() {
        return datastore;
    }
}