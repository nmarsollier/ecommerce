package com.catalog.articles;

import com.catalog.errors.InvalidBodyException;
import com.catalog.utils.JsonTools;

import spark.Spark;

public class ArticleController {
    ArticleService service = new ArticleService();

    public void init() {
        Spark.post("/articles", "application/json", (request, response) -> {
            response.type("application/json");
            Article article = JsonTools.getGson().fromJson(request.body(), Article.class);
            if (article == null) {
                throw new InvalidBodyException("Invalid Body");
            }
            return JsonTools.getGson().toJson(service.addArticle(article));
        });

        Spark.post("/articles/:id", "application/json", (request, response) -> {
            response.type("application/json");
            Article article = JsonTools.getGson().fromJson(request.body(), Article.class);
            return JsonTools.getGson().toJson(service.updateArticle(request.params(":id"), article));
        });

        Spark.get("/articles/:id", (request, response) -> {
            response.type("application/json");
            return JsonTools.getGson().toJson(service.getArticle(request.params(":id")));
        });

        Spark.delete("/articles/:id", (request, response) -> {
            response.type("application/json");
            service.delArticle(request.params(":id"));
            return "";
        });

        Spark.get("/articles/search/:text", (request, response) -> {
            response.type("application/json");
            return JsonTools.getGson().toJson(service.searchArticles(request.params(":text")));
        });
    }
}