"use strict";

/**
 *  Servicios de escucha de eventos rabbit
 */
import * as orderPlaced from "../cart/orderPlaced";
import * as validation from "../cart/validation";
import { RabbitDirectConsumer } from "./tools/directConsumer";
import { RabbitDirectEmitter } from "./tools/directEmitter";
import { IRabbitMessage } from "./tools/common";
import { ICart } from "../cart/schema";
import { RabbitTopicConsumer } from "./tools/topicConsumer";

interface IArticleExistMessage {
    referenceId: string;
    articleId: string;
    valid: boolean;
}
interface IOrderPlacedMessage {
    cartId: string;
    orderId: string;
}

export function init() {
    const cart = new RabbitDirectConsumer("cart", "cart");
    cart.addProcessor("article-exist", processArticleExist);
    cart.init();

    const cart2 = new RabbitTopicConsumer("topic_cart", "sell_flow", "order_placed");
    cart2.addProcessor("order-placed", processOrderPlaced);
    cart2.init();
}

/**
 * @api {direct} cart/article-exist Validación de Artículos
 * @apiGroup RabbitMQ GET
 *
 * @apiDescription Escucha de mensajes article-exist desde cart. Valida artículos
 *
 * @apiSuccessExample {json} Mensaje
 *     {
 *        "type": "article-exist",
 *        "message": {
 *             "referenceId": "{cartId}",
 *             "articleId": "{articleId}",
 *             "valid": true|false
 *        }
 *     }
 */
function processArticleExist(rabbitMessage: IRabbitMessage) {
    const article = rabbitMessage.message as IArticleExistMessage;
    validation.articleValidationCheck(article);
}

/**
 *
 * @api {topic} order/order-placed Orden Creada
 *
 * @apiGroup RabbitMQ
 *
 * @apiDescription Consume de mensajes order-placed desde Order con el topic "order_placed".
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
 */
function processOrderPlaced(rabbitMessage: IRabbitMessage) {
    const placed = rabbitMessage.message as IOrderPlacedMessage;
    orderPlaced.orderPlaced(placed);
}

/**
 * @api {direct} catalog/article-exist Comprobar Articulo
 * @apiGroup RabbitMQ POST
 *
 * @apiDescription Cart enviá un mensaje a Catalog para comprobar la validez de un articulo.
 *
 * @apiExample {json} Mensaje
 *     {
 *        "type": "article-exist",
 *        "queue": "cart",
 *        "exchange": "cart",
 *         "message": {
 *             "referenceId": "{cartId}",
 *             "articleId": "{articleId}"
 *        }
 *     }
 */
/**
 * Enviá una petición a catalog para validar si un articulo puede incluirse en el cart.
 */
export async function sendArticleValidation(cartId: string, articleId: string): Promise<IRabbitMessage> {
    const message: IRabbitMessage = {
        type: "article-exist",
        exchange: "cart",
        queue: "cart",
        message: {
            referenceId: cartId,
            articleId: articleId
        }
    };

    return RabbitDirectEmitter.getEmitter("catalog", "catalog").send(message);
}

/**
 * @api {direct} catalog/place-order Crear Ordern
 * @apiGroup RabbitMQ POST
 *
 * @apiDescription Cart enviá un mensaje a Order para crear una nueva orden.
 *
 * @apiExample {json} Mensaje
 *     {
 *        "type": "place-order",
 *        "queue": "order",
 *        "exchange": "order",
 *         "message": {
 *             "cartId": "{cartId}",
 *             "userId": "{userId}",
 *             "articles": "{
 *                  "id": "{articleId}",
 *                  "quantity": {value}
 *                  }, ...
 *             ]"
 *        }
 *     }
 */
export async function sendPlaceOrder(cart: ICart): Promise<IRabbitMessage> {
    const message: IRabbitMessage = {
        type: "place-order",
        exchange: "cart",
        queue: "cart",
        message: {
            cartId: cart._id,
            userId: cart.userId,
            articles: cart.articles.map(a => {
                return {
                    id: a.articleId,
                    quantity: a.quantity
                };
            })
        }
    };

    return RabbitDirectEmitter.getEmitter("order", "order").send(message);
}