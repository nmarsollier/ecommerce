"use strict";

/**
 *  Servicios de escucha de eventos rabbit
 */
import amqp = require("amqplib");
import * as validation from "../cart/validation";
import * as orderPlaced from "../cart/orderPlaced";
import * as token from "../token";
import * as env from "../server/environment";

const conf = env.getConfig(process.env);

interface IRabbitMessage {
    type: string;
    message: any;
}

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
    initCart();
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

/**
 * @api {direct} cart/order-placed Validación de Artículos
 * @apiGroup RabbitMQ GET
 *
 * @apiDescription Escucha de mensajes order-placed desde Order.
 *
 * @apiSuccessExample {json} Mensaje
 *     {
 *        "type": "order-placed",
 *        "message": {
 *             "cartId": "{cartId}",
 *             "orderId": "{orderId}"
 *        }
 *     }
 */

/**
 * Escucha eventos específicos de cart.
 *
 * article-exist : Es un evento que lo envía Catalog indicando que un articulo existe y es valido para el cart.
 */
async function initCart() {
    try {
        const conn = await amqp.connect("amqp://localhost");

        const channel = await conn.createChannel();

        channel.on("close", function () {
            console.error("RabbitMQ conexión cerrada, intentado reconecta en 10'");
            setTimeout(() => init(), 10000);
        });

        console.log("RabbitMQ LCart conectado");

        const exchange = await channel.assertExchange("cart", "direct", { durable: false });

        const queue = await channel.assertQueue("cart", { durable: false });

        channel.bindQueue(queue.queue, exchange.exchange, queue.queue);

        channel.consume(queue.queue,
            (message) => {
                const rabbitMessage: IRabbitMessage = JSON.parse(message.content.toString());
                switch (rabbitMessage.type) {
                    case "article-exist":
                        const article = rabbitMessage.message as IArticleExistMessage;
                        validation.articleValidationCheck(article);
                    case "order-placed":
                        const placed = rabbitMessage.message as IOrderPlacedMessage;
                        orderPlaced.orderPlaced(placed);
                }
            }, { noAck: true });

    } catch (err) {
        console.error("RabbitMQ LCart" + err.message);
        setTimeout(() => initCart(), 10000);
    }
}
