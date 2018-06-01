package com.catalog;

import java.util.List;
import java.util.stream.Collectors;

import com.catalog.articles.ArticleController;
import com.catalog.errors.InvalidArgumentException;
import com.catalog.errors.InvalidBodyException;
import com.catalog.errors.MultipleArgumentsException;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import spark.Spark;

public class Main {
    static int PORT = 3002;

    public static void main(String[] args) {
        Spark.port(PORT);
        Spark.exception(Exception.class, (exception, request, response) -> {
            exception.printStackTrace();
            response.type("application/json");
            response.status(500);
            JsonObject result = new JsonObject();
            result.addProperty("error", "Internal server error");
            result.addProperty("message", exception.getMessage());
            response.body(result.toString());
        });

        Spark.exception(InvalidArgumentException.class, (exception, request, response) -> {
            exception.printStackTrace();
            response.type("application/json");
            response.status(400);
            JsonObject result = new JsonObject();
            result.addProperty("path", exception.path);
            result.addProperty("message", exception.message);
            response.body(result.toString());
        });

        Spark.exception(InvalidBodyException.class, (exception, request, response) -> {
            exception.printStackTrace();
            response.type("application/json");
            response.status(400);
            JsonObject result = new JsonObject();
            result.addProperty("error", exception.error);
            response.body(result.toString());
        });

        Spark.exception(MultipleArgumentsException.class, (exception, request, response) -> {
            exception.printStackTrace();
            response.type("application/json");
            response.status(400);

            List<JsonObject> errors = exception.getErrors().stream().map((it) -> {
                JsonObject result = new JsonObject();
                result.addProperty("path", it.path);
                result.addProperty("message", it.message);
                return result;
            }).collect(Collectors.toList());

            JsonArray result = new JsonArray();
            errors.forEach((it) -> result.add(it));

            response.body(result.toString());
        });

        new ArticleController().init();

        System.out.println("Catalog escuchando en el puerto " + PORT);
    }
}
