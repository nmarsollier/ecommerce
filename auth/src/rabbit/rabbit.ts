"use strict";

import amqp = require("amqplib");
import * as env from "../server/environment";
const conf = env.getConfig(process.env);

interface IRabbitMessage {
    type: string;
    message: any;
}

let channel: amqp.Channel;

/**
 * @api {fanout} auth/fanout Invalidar Token
 * @apiGroup RabbitMQ POST
 *
 * @apiDescription AuthService enviá un broadcast a todos los usuarios cuando un token ha sido invalidado. Los clientes deben eliminar de sus caches las sesiones invalidadas.
 *
 * @apiSuccessExample {json} Mensaje
 *     {
 *        "type": "logout",
 *        "message": "{Token revocado}"
 *     }
 */
export function sendLogout(token: string): Promise<IRabbitMessage> {
    return sendMessage({
        type: "logout",
        message: token
    });
}

async function sendMessage(message: IRabbitMessage): Promise<IRabbitMessage> {
    const channel = await getChannel();
    try {
        const exchange = await channel.assertExchange("auth", "fanout", { durable: false });
        if (channel.publish(exchange.exchange, "", new Buffer(JSON.stringify(message)))) {
            return Promise.resolve(message);
        } else {
            return Promise.reject(new Error("No se pudo encolar el mensaje"));
        }
    } catch (err) {
        console.log("RabbitMQ " + err);
        return Promise.reject(err);
    }
}

async function getChannel(): Promise<amqp.Channel> {
    if (!channel) {
        try {
            const conn = await amqp.connect(conf.rabbitUrl);
            channel = await conn.createChannel();
            console.log("RabbitMQ conectado");
            channel.on("close", function () {
                console.error("RabbitMQ Conexión cerrada");
                channel = undefined;
            });
        } catch (onReject) {
            console.error("RabbitMQ " + onReject.message);
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

