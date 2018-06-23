"use strict";

/**
 * Son eventos enviados a rabbit.
 */
import amqp = require("amqplib");

import * as env from "../server/environment";
import { ICart } from "../cart/schema";
const conf = env.getConfig(process.env);

let channel: amqp.Channel;

interface IRabbitCallbackMessage {
    type: string;
    message: any;
    exchange: string;
    queue: string;
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
/**
 * Enviá una petición a order para hacer un place.
 */
export async function placeOrder(cart: ICart): Promise<IRabbitCallbackMessage> {
    try {
        const message: IRabbitCallbackMessage = {
            type: "place-order",
            exchange: "cart",
            queue: "cart",
            message: {
                cartId: cart._id,
                userId: cart.userId,
                articles: cart.articles.map( a => {
                    return {
                        id: a.articleId,
                        quantity: a.quantity
                    };
                })
            }
        };

        const channel = await getChannel();
        const exchange = await channel.assertExchange("order", "direct", { durable: false });
        const queue = await channel.assertQueue("order", { durable: false });

        if (channel.publish(exchange.exchange, queue.queue, new Buffer(JSON.stringify(message)))) {
            console.log("RabbitMQ Publish PlaceOrder : " + message);
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

