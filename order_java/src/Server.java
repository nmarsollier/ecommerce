
import java.util.logging.Level;
import java.util.logging.Logger;

import application.RabbitController;
import application.RestController;
import spark.Spark;
import utils.errors.ErrorHandler;
import utils.errors.SimpleError;
import utils.server.CorsFilter;
import utils.server.Environment;

public class Server {

    public static void main(String[] args) {
        new Server().start();
    }

    void start() {
        Spark.notFound((req, res) -> ErrorHandler.handleInternal(new SimpleError(404, "Not Found"), req, res));
        Spark.exception(Exception.class, (ex, req, res) -> ErrorHandler.handleInternal(ex, req, res));
        Spark.port(Environment.getEnv().serverPort);
        Spark.staticFiles.location(Environment.getEnv().staticLocation);
        CorsFilter.apply();

        RabbitController.init();

        Spark.get("/v1/orders/:orderId", (req, res) -> RestController.getOrder(req, res));
        Spark.get("/v1/orders_batch/placed", (req, res) -> RestController.processPlacedOrders(req, res));
        Spark.get("/v1/orders_batch/validated", (req, res) -> RestController.processValidatedOrders(req, res));
        Spark.get("/v1/orders_batch/payment_defined", (req, res) -> RestController.processPaymentDefinedOrders(req, res));
        Spark.get("/v1/orders", (req, res) -> RestController.getUserOrders(req, res));
        Spark.post("/v1/orders/:orderId/payment", (req, res) -> RestController.addPayment(req, res));

        Logger.getLogger("Validator").log(Level.INFO,
                "Order Service escuchando en el puerto : " + Environment.getEnv().serverPort);
    }
}
