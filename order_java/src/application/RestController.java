package application;

import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import com.google.gson.annotations.SerializedName;

import org.bson.types.ObjectId;
import org.mongodb.morphia.query.ValidationException;

import events.EventService;
import events.schema.PaymentData;
import events.schema.PaymentEvent;
import projections.common.Status;
import projections.order.OrderService;
import projections.order.schema.Order;
import projections.orderStatus.OrderStatusRepository;
import projections.orderStatus.schema.OrderStatus;
import security.TokenService;
import security.User;
import spark.Request;
import spark.Response;
import utils.errors.ErrorHandler;
import utils.errors.SimpleError;
import utils.errors.ValidationError;
import utils.gson.Builder;
import utils.gson.JsonSerializable;

public class RestController {
    /**
     * @api {get} /v1/orders/:orderId Buscar Orden
     * @apiName Buscar Orden
     * @apiGroup Ordenes
     *
     * @apiDescription Busca una order del usuario logueado, por su id.
     *
     * @apiUse AuthHeader
     *
     * @apiSuccessExample {json} Respuesta
     *   HTTP/1.1 200 OK
     *   {
     *      "id": "{orderID}",
     *      "status": "{Status}",
     *      "cartId": "{cartId}",
     *      "updated": "{updated date}",
     *      "created": "{created date}",
     *      "articles": [
     *         {
     *             "id": "{articleId}",
     *             "quantity": {quantity},
     *             "validated": true|false,
     *             "valid": true|false
     *         }, ...
     *     ]
     *   }
     *
     * @apiUse Errors
     */
    public static String getOrder(Request req, Response res) {
        try {
            User usr = TokenService.getUser(req.headers("Authorization"));

            Order order = OrderService.getInstance().buildOrder(new ObjectId(req.params(":orderId")));
            if (order == null) {
                throw new ValidationError().addPath("orderId", "Not Found");
            }
            if (!order.getUserId().equals(usr.id)) {
                return null;
            }

            return new OrderData(order).toJson();
        } catch (SimpleError | ValidationError e) {
            return ErrorHandler.handleError(res, e);
        }
    }

    /**
     * @api {get} /v1/orders_batch/placed Batch Placed
     * @apiName Batch Placed
     * @apiGroup Ordenes
     *
     * @apiDescription Ejecuta un proceso batch que chequea ordenes en estado PLACED.
     *
     * @apiUse AuthHeader
     *
     * @apiSuccessExample {json} Respuesta
     *   HTTP/1.1 200 OK
     *
     *
     * @apiUse Errors
     */
    public static String processPlacedOrders(Request req, Response res) {
        try {
            TokenService.validate(req.headers("Authorization"));

            BatchService.processPlacedOrders();

            return "";
        } catch (SimpleError e) {
            return ErrorHandler.handleError(res, e);
        }
    }

    /**
    * @api {get} /v1/orders_batch/validated Batch Validated
    * @apiName Batch Validated
    * @apiGroup Ordenes
    *
    * @apiDescription Ejecuta un proceso batch para ordenes en estado VALIDATED.
    *
    * @apiUse AuthHeader
    *
    * @apiSuccessExample {json} Respuesta
    *   HTTP/1.1 200 OK
    *
    *
    * @apiUse Errors
    */
    public static String processValidatedOrders(Request req, Response res) {
        try {
            TokenService.validate(req.headers("Authorization"));

            BatchService.processValidatedOrders();

            return "";
        } catch (SimpleError e) {
            return ErrorHandler.handleError(res, e);
        }
    }

    /**
    * @api {get} /v1/orders_batch/payment_defined Batch Payment Defined
    * @apiName Batch Payment Defined
    * @apiGroup Ordenes
    *
    * @apiDescription Ejecuta un proceso batch que chequea ordenes en estado PAYMENT_DEFINED.
    *
    * @apiUse AuthHeader
    *
    * @apiSuccessExample {json} Respuesta
    *   HTTP/1.1 200 OK
    *
    *
    * @apiUse Errors
    */
    public static String processPaymentDefinedOrders(Request req, Response res) {
        try {
            TokenService.validate(req.headers("Authorization"));

            BatchService.processPaymentDefinedOrders();

            return "";
        } catch (SimpleError e) {
            return ErrorHandler.handleError(res, e);
        }
    }

    /**
     * @api {get} /v1/orders Ordenes de Usuario
     * @apiName Ordenes de Usuario
     * @apiGroup Ordenes
     *
     * @apiDescription Busca todas las ordenes del usuario logueado.
     *
     * @apiUse AuthHeader
     *
     *  @apiSuccessExample {json} Respuesta
     *   HTTP/1.1 200 OK
     *   [{
     *      "id": "{orderID}",
     *      "status": "{Status}",
     *      "cartId": "{cartId}",
     *      "updated": "{updated date}",
     *      "created": "{created date}",
     *      "totalPrice": {price}
     *      "articles": {count}
     *   }, ...
     *   ]
     * @apiUse Errors
     */
    public static String getUserOrders(Request req, Response res) {
        try {
            User usr = TokenService.getUser(req.headers("Authorization"));

            List<OrderStatus> orders = OrderStatusRepository.getInstance().findByUserId(usr.id);

            return Builder.gson().toJson(orders.stream().map(o -> new OrderListData(o)).collect(Collectors.toList()));
        } catch (SimpleError e) {
            return ErrorHandler.handleError(res, e);
        }
    }

    /**
    * @api {post} /v1/articles/ Crear Artículo
    * @apiName Crear Artículo
    * @apiGroup Artículos
    *
    * @apiUse AuthHeader
    *
    * @apiExample {json} Body
    *   {
    *       "orderId": "{orderId}",
    *       "paymentMethod": "CASH | CREDIT | DEBIT",
    *       "amount": "{amount}"
    *   }
    *
    * @apiSuccessExample {json} Respuesta
    *   HTTP/1.1 200 OK
    *
    * @apiUse Errors
    */
    public static String addPayment(Request req, Response res) {
        try {
            User user = TokenService.getUser(req.headers("Authorization"));

            String orderId = req.params(":orderId");

            PaymentData payment = PaymentData.fromJson(req.body());
            payment.orderId = orderId;
            payment.userId = user.id;

            EventService.getInstance().placePayment(payment);

            return "";
        } catch (ValidationException ev) {
            return ErrorHandler.handleInternal(ev, req, res);
        } catch (ValidationError | SimpleError e) {
            return ErrorHandler.handleError(res, e);
        } catch (javax.xml.bind.ValidationException e) {
            return ErrorHandler.handleInternal(e, req, res);
        }
    }

    public static class OrderData implements JsonSerializable {
        @SerializedName("id")
        public String id;

        @SerializedName("status")
        public Status status;

        @SerializedName("cartId")
        public String cartId;

        @SerializedName("totalPrice")
        public double totalPrice;

        @SerializedName("totalPayment")
        public double totalPayment;

        public Date updated = new Date();
        public Date created = new Date();

        @SerializedName("articles")
        public Article[] articles = new Article[] {};

        @SerializedName("payment")
        public Payment[] payment = new Payment[] {};

        public OrderData(Order order) {
            id = order.getId().toHexString();
            status = order.getStatus();
            cartId = order.getCartId();
            totalPrice = order.getTotalPrice();
            totalPayment = order.getTotalPayment();
            updated = order.getUpdated();
            created = order.getCreated();
            articles = Arrays.stream(order.getArticles()).map(
                    a -> new Article(a.getId(), a.getQuantity(), a.isValidated(), a.isValid(), a.getUnitaryPrice()))
                    .collect(Collectors.toList()).toArray(new Article[] {});
            payment = Arrays.stream(order.getPayment()).map(a -> new Payment(a.getMethod(), a.getAmount()))
                    .collect(Collectors.toList()).toArray(new Payment[] {});

        }

        public static class Article {
            @SerializedName("id")
            public String id;

            @SerializedName("quantity")
            public int quantity;

            @SerializedName("unitaryPrice")
            public double unitaryPrice;

            @SerializedName("validated")
            public boolean validated;

            @SerializedName("valid")
            public boolean valid;

            public Article(String id, int quantity, boolean validated, boolean valid, double unitaryPrice) {
                this.id = id;
                this.quantity = quantity;
                this.validated = validated;
                this.valid = valid;
                this.unitaryPrice = unitaryPrice;
            }
        }

        public static class Payment {
            @SerializedName("method")
            public PaymentEvent.Method method;

            @SerializedName("amount")
            public double amount;

            public Payment(PaymentEvent.Method method, double amount) {
                this.method = method;
                this.amount = amount;
            }
        }

        @Override
        public String toJson() {
            return Builder.gson().toJson(this);
        }
    }

    public static class OrderListData implements JsonSerializable {
        @SerializedName("id")
        public String id;

        @SerializedName("status")
        public Status status;

        @SerializedName("cartId")
        public String cartId;

        @SerializedName("totalPrice")
        public double totalPrice;

        @SerializedName("totalPayment")
        public double totalPayment;

        public Date updated = new Date();
        public Date created = new Date();

        @SerializedName("articles")
        public int articles;

        public OrderListData(OrderStatus order) {
            id = order.getId().toHexString();
            status = order.getStatus();
            cartId = order.getCartId();
            totalPrice = order.getTotalPrice();
            totalPayment = order.getPayment();
            updated = order.getUpdated();
            created = order.getCreated();
            articles = order.getArticles();
        }

        @Override
        public String toJson() {
            return Builder.gson().toJson(this);
        }
    }
}
