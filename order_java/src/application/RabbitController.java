package application;

import com.google.gson.annotations.SerializedName;

import events.EventService;
import events.schema.Event;
import events.schema.NewArticleValidationData;
import events.schema.NewPlaceData;
import security.TokenService;
import utils.rabbit.DirectConsumer;
import utils.rabbit.DirectPublisher;
import utils.rabbit.FanoutConsumer;
import utils.rabbit.RabbitEvent;

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
     *     "type": "article-exist",
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
            sendOrderPlaced(event, data.getOrderId().toHexString(),
                    data.getPlaceEvent().getCartId());
        } catch (Exception e) {
            e.printStackTrace();
            return;
        }
    }

    /**
    *
    * @api {direct} order/artcle-data Validar Artículos
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
     * @api {direct} order/order-placed Orden Creada
     *
     * @apiGroup RabbitMQ POST
     *
     * @apiDescription Envía de mensajes order-placed desde Order. Valida artículos
     *
     * @apiSuccessExample {json} Mensaje
     *     {
     *     "type": "order-placed",
     *     "message" : {
     *         "cartId": "{cartId}",
     *         "orderId": "{orderId}"
     *        }
     *     }
     *
     */
    public static void sendOrderPlaced(RabbitEvent event, String orderId, String cartId) {
        RabbitEvent eventToSend = new RabbitEvent();
        eventToSend.type = "order-placed";
        eventToSend.message = new OrderPlacedResponse(orderId, cartId);

        DirectPublisher.publish(event.exchange, event.queue, eventToSend);
    }

    private static class OrderPlacedResponse {
        OrderPlacedResponse(String orderId, String cartId) {
            this.orderId = orderId;
            this.cartId = cartId;
        }

        @SerializedName("orderId")
        public String orderId;
        @SerializedName("cartId")
        public String cartId;
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