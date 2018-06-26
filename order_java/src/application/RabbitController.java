package application;

import java.util.Arrays;
import java.util.stream.Collectors;

import com.google.gson.annotations.SerializedName;

import events.EventService;
import events.schema.Event;
import events.schema.NewArticleValidationData;
import events.schema.NewPlaceData;
import events.schema.PlaceEvent;
import events.schema.PlaceEvent.Article;
import security.TokenService;
import utils.rabbit.DirectConsumer;
import utils.rabbit.DirectPublisher;
import utils.rabbit.FanoutConsumer;
import utils.rabbit.RabbitEvent;
import utils.rabbit.TopicPublisher;

public class RabbitController {

    public static void init() {
        FanoutConsumer fanoutConsumer = new FanoutConsumer("auth");
        fanoutConsumer.addProcessor("logout", e -> RabbitController.logout(e));
        fanoutConsumer.start();

        DirectConsumer directConsumer = new DirectConsumer("order", "order");
        directConsumer.addProcessor("place-order", e -> RabbitController.placeOrder(e));
        directConsumer.addProcessor("article-data", e -> RabbitController.articleData(e));
        directConsumer.start();
    }

    /**
     * @api {fanout} auth/logout Logout
     *
     * @apiGroup RabbitMQ GET
     *
     * @apiDescription Escucha de mensajes logout desde auth. Invalida sesiones en cache.
     *
     * @apiExample {json} Mensaje
     *   {
     *     "type": "logout",
     *     "message" : "tokenId"
     *   }
     */
    public static void logout(RabbitEvent event) {
        TokenService.invalidate(event.message.toString());
    }

    /**
    *
    * @api {direct} order/place-order Crear Orden
    *
    * @apiGroup RabbitMQ GET
    *
    * @apiDescription Escucha de mensajes place-order en el canal de order.
    *
    * @apiExample {json} Mensaje
    *     {
    *     "type": "place-order",
    *     "exchange" : "{Exchange name to reply}"
    *     "queue" : "{Queue name to reply}"
    *     "message" : {
    *         "cartId": "{cartId}",
    *         "articles": "[articleId, ...]",
    *     }
    */
    public static void placeOrder(RabbitEvent event) {
        NewPlaceData cart = NewPlaceData.fromJson(event.message.toString());
        try {
            Event data = EventService.getInstance().placeOrder(cart);
            sendOrderPlaced(data);
        } catch (Exception e) {
            e.printStackTrace();
            return;
        }
    }

    /**
    *
    * @api {direct} order/article-data Validar Artículos
    *
    * @apiGroup RabbitMQ GET
    *
    * @apiDescription Antes de iniciar las operaciones se validan los artículos contra el catalogo.
    *
    * @apiExample {json} Mensaje
    *     {
    *     "type": "article-data",
    *     "message" : {
    *         "cartId": "{cartId}",
    *         "articleId": "{articleId}",
    *         "valid": True|False
    *        }
    *     }
    */
    public static void articleData(RabbitEvent event) {
        NewArticleValidationData articleExist = NewArticleValidationData.fromJson(event.message.toString());
        try {
            EventService.getInstance().placeArticleExist(articleExist);
        } catch (Exception e) {
            e.printStackTrace();
            return;
        }
    }

    /**
     *
     * @api {topic} order/order-placed Orden Creada
     *
     * @apiGroup RabbitMQ POST
     *
     * @apiDescription Envía de mensajes order-placed desde Order con el topic "order_placed".
     *
     * @apiSuccessExample {json} Mensaje
     *     {
     *     "type": "order-placed",
     *     "message" : {
     *         "cartId": "{cartId}",
     *         "orderId": "{orderId}"
     *         "articles": [{
     *              "articleId": "{article id}"
     *              "quantity" : {quantity}
     *          }, ...]
     *        }
     *     }
     *
     */
    public static void sendOrderPlaced(Event event) {
        RabbitEvent eventToSend = new RabbitEvent();
        eventToSend.type = "order-placed";
        eventToSend.exchange = "order";
        eventToSend.queue = "order";

        eventToSend.message = new OrderPlacedResponse(event.getOrderId().toHexString(),
                event.getPlaceEvent().getCartId(), event.getPlaceEvent().getArticles());

        TopicPublisher.publish("sell_flow", "order_placed", eventToSend);
    }

    private static class OrderPlacedResponse {
        @SerializedName("orderId")
        public String orderId;
        @SerializedName("cartId")
        public String cartId;
        @SerializedName("articles")
        private OrderPlacedResponse.Article[] articles;

        OrderPlacedResponse() {

        }

        OrderPlacedResponse(String orderId, String cartId, PlaceEvent.Article[] articles) {
            this.orderId = orderId;
            this.cartId = cartId;
            this.articles = Arrays.stream(articles) //
                    .map(a -> new Article(a.getArticleId(), a.getQuantity())) //
                    .collect(Collectors.toList()) //
                    .toArray(new OrderPlacedResponse.Article[] {});

        }

        public static class Article {
            @SerializedName("articleId")
            private String articleId;

            @SerializedName("quantity")
            private int quantity;

            public Article() {
            }

            public Article(String articleId, int quantity) {
                this.articleId = articleId;
                this.quantity = quantity;
            }
        }
    }

    /**
     *
     * @api {direct} cart/article-data Validación de Artículos
     *
     * @apiGroup RabbitMQ POST
     *
     * @apiDescription Antes de iniciar las operaciones se validan los artículos contra el catalogo.
     *
     * @apiSuccessExample {json} Mensaje
     *     {
     *     "type": "article-data",
     *     "message" : {
     *         "cartId": "{cartId}",
     *         "articleId": "{articleId}",
     *        }
     *     }
     */
    public static void sendArticleValidation(String orderId, String articleId) {
        ArticleValidationData data = new ArticleValidationData(orderId, articleId);

        RabbitEvent eventToSend = new RabbitEvent();
        eventToSend.type = "article-data";
        eventToSend.exchange = "order";
        eventToSend.queue = "order";
        eventToSend.message = data;

        DirectPublisher.publish("catalog", "catalog", eventToSend);
    }

    private static class ArticleValidationData {
        ArticleValidationData(String referenceId, String articleId) {
            this.referenceId = referenceId;
            this.articleId = articleId;
        }

        @SerializedName("referenceId")
        public String referenceId;
        @SerializedName("articleId")
        public String articleId;
    }
}