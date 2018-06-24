
import application.RabbitController;
import application.RestController;
import spark.Spark;
import utils.db.MongoStore;
import utils.errors.ErrorHandler;
import utils.server.CorsFilter;
import utils.server.Environment;

public class Server {

    public static void main(String[] args) {
        new Server().start();
    }

    void start() {
        MongoStore.init();

        Spark.exception(Exception.class, (ex, req, res) -> ErrorHandler.handleInternal(ex, req, res));
        Spark.port(Environment.getEnv().serverPort);
        Spark.staticFiles.location(Environment.getEnv().staticLocation);
        CorsFilter.apply();

        Spark.post("/v1/articles", (req, res) -> RestController.addArticle(req, res));
        Spark.post("/v1/articles/:articleId", (req, res) -> RestController.updateArticle(req, res));
        Spark.get("/v1/articles/:articleId", (req, res) -> RestController.getArticle(req, res));
        Spark.delete("/v1/articles/:articleId", (req, res) -> RestController.deleteArticle(req, res));
        Spark.get("/v1/articles/search/:criteria", (req, res) -> RestController.searchArticles(req, res));

        RabbitController.init();
    }

}