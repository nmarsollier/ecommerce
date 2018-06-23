"use strict";

/**
 *  Servicios de escucha de eventos rabbit
 */
import amqp = require("amqplib");
import * as cartService from "../cart/validation";
import * as token from "../token";
import * as env from "../server/environment";

const conf = env.getConfig(process.env);

interface IRabbitMessage {
    type: string;
    message: any;
}

export function init() {
    initAuth();
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
                        console.log("RabbitMQ Consume logout " + rabbitMessage.message);
                        token.invalidate(rabbitMessage.message);
                }
            }, { noAck: true });

    } catch (err) {
        console.error("RabbitMQ Auth " + err.message);
        setTimeout(() => initAuth(), 10000);
    }
}
