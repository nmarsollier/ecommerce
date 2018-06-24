package application;

import com.google.gson.annotations.SerializedName;

import article.Article;
import article.ArticleRepository;
import article.vo.ArticleData;
import security.TokenService;
import utils.errors.ValidationError;
import utils.gson.Builder;
import utils.gson.JsonSerializable;
import utils.rabbit.DirectConsumer;
import utils.rabbit.DirectPublisher;
import utils.rabbit.FanoutConsumer;
import utils.rabbit.RabbitEvent;
import utils.validator.Required;
import utils.validator.Validator;

public class RabbitController {

    public static void init() {
        FanoutConsumer fanoutConsumer = new FanoutConsumer("auth");
        fanoutConsumer.addProcessor("logout", e -> processLogout(e));
        fanoutConsumer.start();

        DirectConsumer directConsumer = new DirectConsumer("catalog", "catalog");
        directConsumer.addProcessor("article-exist", e -> processArticleExist(e));
        directConsumer.addProcessor("article-data", e -> processArticleData(e));
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
    static void processLogout(RabbitEvent event) {
        TokenService.invalidate(event.message.toString());
    }

    /**
     *
     * @api {direct} catalog/article-exist Validación de Artículos
     *
     * @apiGroup RabbitMQ GET
     *
     * @apiDescription Escucha de mensajes article-exist desde cart. Valida artículos
     *
     * @apiExample {json} Mensaje
     *     {
     *     "type": "article-exist",
     *     "exchange" : "{Exchange name to reply}"
     *     "queue" : "{Queue name to reply}"
     *     "message" : {
     *         "referenceId": "{redId}",
     *         "articleId": "{articleId}",
     *     }
     */
    static void processArticleExist(RabbitEvent event) {
        EventArticleExist exist = EventArticleExist.fromJson(event.message.toString());
        try {
            System.out.println("RabbitMQ Consume article-exist : " + exist.articleId);

            Validator.validate(exist);
            Article article = ArticleRepository.getInstance().get(exist.articleId);
            exist.valid = article.enabled();
            sendArticleValidation(event, exist);
        } catch (ValidationError validation) {
            exist.valid = false;
            sendArticleValidation(event, exist);
        } catch (Exception article) {
            return;
        }
    }

    /**
     *
     * @api {direct} catalog/article-data Validación de Artículos
     *
     * @apiGroup RabbitMQ GET
     *
     * @apiDescription Escucha de mensajes article-data desde cart. Valida artículos
     *
     * @apiExample {json} Mensaje
     *     {
     *     "type": "article-exist",
     *     "exchange" : "{Exchange name to reply}"
     *     "queue" : "{Queue name to reply}"
     *     "message" : {
     *         "referenceId": "{redId}",
     *         "articleId": "{articleId}"
     *     }
     */
    static void processArticleData(RabbitEvent event) {
        EventArticleExist exist = EventArticleExist.fromJson(event.message.toString());
        try {
            System.out.println("RabbitMQ Consume article-data : " + exist.articleId);

            Validator.validate(exist);
            ArticleData article = ArticleRepository.getInstance().get(exist.articleId).value();

            EventArticleData data = new EventArticleData();
            data.articleId = article.id;
            data.price = article.price;
            data.referenceId = exist.referenceId;
            data.stock = article.stock;
            data.valid = article.enabled;

            sendArticleData(event, data);
        } catch (ValidationError validation) {
            EventArticleData data = new EventArticleData();
            data.articleId = exist.articleId;
            data.referenceId = exist.referenceId;
            data.valid = false;
            sendArticleData(event, data);
        } catch (Exception article) {
            return;
        }
    }

    /**
    *
    * @api {direct} cart/article-exist Validación de Artículos
    *
    * @apiGroup RabbitMQ POST
    *
    * @apiDescription Enviá de mensajes article-exist desde cart. Valida artículos
    *
    * @apiSuccessExample {json} Mensaje
    *     {
    *     "type": "article-exist",
    *     "message" : {
    *         "cartId": "{cartId}",
    *         "articleId": "{articleId}",
    *         "valid": True|False
    *        }
    *     }
    *
    */
    public static void sendArticleValidation(RabbitEvent event, EventArticleExist send) {
        RabbitEvent eventToSend = new RabbitEvent();
        eventToSend.type = "article-exist";
        eventToSend.message = send;

        DirectPublisher.publish(event.exchange, event.queue, eventToSend);
    }

    /**
    *
    * @api {direct} cart/article-exist Validación de Articulos
    *
    * @apiGroup RabbitMQ POST
    *
    * @apiDescription Enviá de mensajes article-data desde cart. Valida articulos
    *
    * @apiSuccessExample {json} Mensaje
    *     {
    *     "type": "article-data",
    *     "message" : {
    *         "cartId": "{cartId}",
    *         "articleId": "{articleId}",
    *         "valid": True|False,
    *         "stock": {stock}
    *         "price": {price}
    *        }
    *     }
    *
    */
    public static void sendArticleData(RabbitEvent event, EventArticleData send) {
        RabbitEvent eventToSend = new RabbitEvent();
        eventToSend.type = "article-data";
        eventToSend.message = send;

        DirectPublisher.publish(event.exchange, event.queue, eventToSend);
    }

    static class EventArticleData implements JsonSerializable {
        @Required
        @SerializedName("articleId")
        public String articleId;
        @Required
        @SerializedName("referenceId")
        public String referenceId;
        @SerializedName("valid")
        public boolean valid;
        @SerializedName("price")
        public double price;
        @SerializedName("stock")
        public int stock;

        public static EventArticleExist fromJson(String json) {
            return Builder.gson().fromJson(json, EventArticleExist.class);
        }

        @Override
        public String toJson() {
            return Builder.gson().toJson(this);
        }
    }

    static class EventArticleExist implements JsonSerializable {
        @Required
        @SerializedName("articleId")
        public String articleId;
        @Required
        @SerializedName("referenceId")
        public String referenceId;
        @SerializedName("valid")
        public boolean valid;

        public static EventArticleExist fromJson(String json) {
            return Builder.gson().fromJson(json, EventArticleExist.class);
        }

        @Override
        public String toJson() {
            return Builder.gson().toJson(this);
        }
    }
}