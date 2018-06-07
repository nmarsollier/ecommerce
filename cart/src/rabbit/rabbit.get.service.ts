"use strict";

/**
 *  Servicios de escucha de eventos rabbit
 */
import amqp = require("amqplib");
import * as security from "../utils/security";
import * as cartService from "../cart/cart.internal.service";


export interface IRabbitMessage {
    type: string;
    message: any;
}

export interface IArticleExistMessage {
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
function initAuth() {
    const EXCHANGE = "auth";

    amqp.connect("amqp://localhost").then(
        (conn) => {
            conn.createChannel().then(
                (channel) => {
                    channel.on("close", function () {
                        console.error("RabbitMQ Auth conexion cerrada, intentado reconectar en 10'");
                        setTimeout(() => initAuth(), 10000);
                    });

                    console.log("RabbitMQ Auth conectado");

                    channel.assertExchange(EXCHANGE, "fanout", { durable: false });
                    channel.assertQueue("", { exclusive: true }).then(
                        (queue) => {
                            channel.bindQueue(queue.queue, EXCHANGE, "");

                            channel.consume(queue.queue,
                                (message) => {
                                    const rabbitMessage: IRabbitMessage = JSON.parse(message.content.toString());
                                    switch (rabbitMessage.type) {
                                        case "logout":
                                            console.log("RabbitMQ Auth logout " + rabbitMessage.message);
                                            security.invalidateSessionToken(rabbitMessage.message);
                                    }
                                }, { noAck: true });
                        }).catch(
                            (err) => {
                                console.error("RabbitMQ Auth " + err.message);
                                setTimeout(() => initAuth(), 10000);
                            }
                        );
                },
                (err) => {
                    console.error("RabbitMQ Auth " + err.message);
                    setTimeout(() => initAuth(), 10000);
                }
            );
        },
        (err) => {
            console.error("RabbitMQ Auth " + err.message);
            setTimeout(() => initAuth(), 10000);
        });
}


/**
 * @api {direct} cart/article-exist Validacion de Articulos
 * @apiGroup RabbitMQ GET
 *
 * @apiDescription Escucha de mensajes article-exist desde cart. Valida articulos
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
 * Escucha eventos especificos de cart.
 *
 * article-exist : Es un evento que lo envia Catalog indicando que un articulo existe y es valido para el cart.
 */
function initCart() {
    const EXCHANGE = "cart";
    const QUEUE = "cart";

    amqp.connect("amqp://localhost").then(
        (conn) => {
            conn.createChannel().then(
                (channel) => {
                    channel.on("close", function () {
                        console.error("RabbitMQ conexion cerrada, intentado reconectar en 10'");
                        setTimeout(() => init(), 10000);
                    });

                    console.log("RabbitMQ LCart conectado");

                    channel.assertExchange(EXCHANGE, "direct", { durable: false });
                    channel.assertQueue(EXCHANGE, { durable: false }).then(
                        (queue) => {
                            channel.bindQueue(QUEUE, EXCHANGE, QUEUE);

                            channel.consume(QUEUE,
                                (message) => {
                                    const rabbitMessage: IRabbitMessage = JSON.parse(message.content.toString());
                                    switch (rabbitMessage.type) {
                                        case "article-exist":
                                            const article = rabbitMessage.message as IArticleExistMessage;
                                            cartService.articleValidationCheck(article);
                                    }
                                }, { noAck: true });
                        }).catch(
                            (err) => {
                                console.error("RabbitMQ LCart" + err.message);
                                setTimeout(() => initCart(), 10000);
                            }
                        );
                },
                (err) => {
                    console.error("RabbitMQ LCart" + err.message);
                    setTimeout(() => initCart(), 10000);
                }
            );
        },
        (err) => {
            console.error("RabbitMQ LCart" + err.message);
            setTimeout(() => initCart(), 10000);
        });
}
