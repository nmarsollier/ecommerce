"use strict";

/**
 *  Servicios de escucha de eventos rabbit
 */
import amqp = require("amqplib");
import * as cartService from "../cart/cart.validation.service";
import * as token from "../security/token";
import * as env from "../server/environment";

const conf = env.getConfig(process.env);

interface IRabbitMessage {
    type: string;
    message: any;
}

interface IArticleExistMessage {
    type: string;
    cartId: string;
    articleId: string;
    valid: boolean;
}

export function init() {
    initAuth();
    initCart();
}

/**
 * @api {fanout} auth/logout Logout de Usuarios
 * @apiGroup RabbitMQ GET
 *
 * @apiDescription Escucha de mensajes logout desde auth.
 *
 * @apiSuccessExample {json} Mensaje
 *     {
 *        "type": "logout",
 *        "message": "{tokenId}"
 *     }
 */

/**
 * Escucha el evento logout del exchange auth
 */
async function initAuth() {
    try {
        const conn = await amqp.connect(conf.rabbitUrl);

        const channel = await conn.createChannel();

        channel.on("close", function () {
            console.error("RabbitMQ Auth conexión cerrada, intentado reconecta en 10'");
            setTimeout(() => initAuth(), 10000);
        });

        console.log("RabbitMQ Auth conectado");

        const exchange = await channel.assertExchange("auth", "fanout", { durable: false });

        const queue = await channel.assertQueue("", { exclusive: true });

        channel.bindQueue(queue.queue, exchange.exchange, "");

        channel.consume(queue.queue,
            (message) => {
                const rabbitMessage: IRabbitMessage = JSON.parse(message.content.toString());
                switch (rabbitMessage.type) {
                    case "logout":
                        console.log("RabbitMQ Auth logout " + rabbitMessage.message);
                        token.invalidate(rabbitMessage.message);
                }
            }, { noAck: true });

    } catch (err) {
        console.error("RabbitMQ Auth " + err.message);
        setTimeout(() => initAuth(), 10000);
    }
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
 *             "cartId": "{cartId}",
 *             "articleId": "{articleId}",
 *             "valid": true|false
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
                        cartService.articleValidationCheck(article);
                }
            }, { noAck: true });

    } catch (err) {
        console.error("RabbitMQ LCart" + err.message);
        setTimeout(() => initCart(), 10000);
    }
}
