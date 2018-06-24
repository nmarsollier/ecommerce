package utils.server;

import spark.Spark;

/**
 * Filtro para habilitar Cors en Spark
 */
public final class CorsFilter {

    public final static void apply() {
        Spark.options("/*", (request, response) -> {
            return "";
        });

        Spark.before((request, response) -> {
            response.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
            response.header("Access-Control-Allow-Origin", request.headers("Origin"));
            response.header("Access-Control-Allow-Headers", "authorization,content-type");
            response.header("Access-Control-Allow-Credentials", "true");
            response.header("Vary", "Origin, Access-Control-Request-Headers");
            response.type("application/json");
        });
    }
}