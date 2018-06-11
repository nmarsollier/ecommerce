"use strict";

import amqp = require("amqplib");
import * as security from "../utils/security";

import * as env from "../utils/environment";
const conf = env.getConfig(process.env);

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
export async function init() {
    try {
        const conn = await amqp.connect(conf.rabbitUrl);
        const channel = await conn.createChannel();

        channel.on("close", function () {
            console.error("RabbitMQ conexión cerrada, intentado reconectar en 10'");
            setTimeout(() => init(), 10000);
        });

        channel.assertExchange(EXCHANGE, "fanout", { durable: false });

        const queue = await channel.assertQueue("", { exclusive: true });

        channel.bindQueue(queue.queue, EXCHANGE, "");

        console.log("RabbitMQ conectado");

        channel.consume(queue.queue,
            (message) => {
                const rabbitMessage: IRabbitMessage = JSON.parse(message.content.toString());
                switch (rabbitMessage.type) {
                    case "logout":
                        console.log("RabbitMQ logout " + rabbitMessage.message);
                        security.invalidateSessionToken(rabbitMessage.message);
                }
            }, { noAck: true });
    } catch (err) {
        console.error("RabbitMQ " + err.message);
        setTimeout(() => init(), 10000);
        return;
    }
}
