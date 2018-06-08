"use strict";

import amqp = require("amqplib");
import * as security from "../utils/security";

const EXCHANGE = "auth";

export interface IRabbitMessage {
    type: string;
    message: any;
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
export function init() {
    amqp.connect("amqp://localhost").then(
        (conn) => {
            conn.createChannel().then(
                (channel) => {
                    channel.on("close", function () {
                        console.error("RabbitMQ conexión cerrada, intentado reconectar en 10'");
                        setTimeout(() => init(), 10000);
                    });

                    console.log("RabbitMQ conectado");

                    channel.assertExchange(EXCHANGE, "fanout", { durable: false });
                    channel.assertQueue("", { exclusive: true }).then(
                        (queue) => {
                            channel.bindQueue(queue.queue, EXCHANGE, "");

                            channel.consume(queue.queue,
                                (message) => {
                                    const rabbitMessage: IRabbitMessage = JSON.parse(message.content.toString());
                                    switch (rabbitMessage.type) {
                                        case "logout":
                                            console.log("RabbitMQ logout " + rabbitMessage.message);
                                            security.invalidateSessionToken(rabbitMessage.message);
                                    }
                                }, { noAck: true });
                        }).catch(
                            (err) => {
                                console.error("RabbitMQ " + err.message);
                                setTimeout(() => init(), 10000);
                            }
                        );
                },
                (err) => {
                    console.error("RabbitMQ " + err.message);
                    setTimeout(() => init(), 10000);
                }
            );
        },
        (err) => {
            console.error("RabbitMQ " + err.message);
            setTimeout(() => init(), 10000);
        });
}
