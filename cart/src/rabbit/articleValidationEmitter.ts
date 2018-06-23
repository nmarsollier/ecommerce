"use strict";

/**
 * Son eventos enviados a rabbit.
 */
import amqp = require("amqplib");

import * as env from "../server/environment";
const conf = env.getConfig(process.env);

let channel: amqp.Channel;

interface IRabbitCallbackMessage {
    type: string;
    message: any;
    exchange: string;
    queue: string;
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
 *             "cartId": "{cartId}",
 *             "articleId": "{articleId}"
 *        }
 *     }
 */
/**
 * Enviá una petición a catalog para validar si un articulo puede incluirse en el cart.
 */
export async function sendArticleValidation(cartId: string, articleId: string): Promise<IRabbitCallbackMessage> {
    try {
        const message: IRabbitCallbackMessage = {
            type: "article-exist",
            exchange: "cart",
            queue: "cart",
            message: {
                cartId: cartId,
                articleId: articleId
            }
        };

        const channel = await getChannel();
        const exchange = await channel.assertExchange("catalog", "direct", { durable: false });
        const queue = await channel.assertQueue("catalog", { durable: false });

        if (channel.publish(exchange.exchange, queue.queue, new Buffer(JSON.stringify(message)))) {
            console.log("RabbitMQ Cart : Article check encolado " + message);
            return Promise.resolve(message);
        } else {
            return Promise.reject(new Error("No se pudo encolar el mensaje"));
        }

    } catch (err) {
        return new Promise<IRabbitCallbackMessage>((resolve, reject) => {
            console.log("RabbitMQ Cart " + err);
            return Promise.reject(err);
        });
    }
}

async function getChannel(): Promise<amqp.Channel> {
    if (!channel) {
        try {
            const conn = await amqp.connect(conf.rabbitUrl);

            channel = await conn.createChannel();

            console.log("RabbitMQ Cart conectado");

            channel.on("close", function () {
                console.error("RabbitMQ Cart Conexión cerrada");
                channel = undefined;
            });
        } catch (onReject) {
            console.error("RabbitMQ Cart " + onReject.message);
            channel = undefined;
            return Promise.reject(onReject);
        }
    }
    if (channel) {
        return Promise.resolve(channel);
    } else {
        return Promise.reject(new Error("No channel available"));
    }
}

