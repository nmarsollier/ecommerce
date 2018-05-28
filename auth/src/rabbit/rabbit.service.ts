"use strict";

import amqp = require("amqplib");
import { IUserSession } from "../security/security.service";

export interface IRabbitMessage {
    type: string;
    message: any;
}
const QUEUE = "auth";
let channel: amqp.Channel;

/**
 * @api {broadcast} auth/fanout Invalidar Token
 * @apiGroup RabbitMQ
 *
 * @apiDescription AuthService envia un broadcast a todos los usuarios cuando un token ha sido invalidado. Los clientes deben eliminar de sus caches las sesiones invalidadas.
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

function sendMessage(message: IRabbitMessage): Promise<IRabbitMessage> {
    return new Promise<IRabbitMessage>((resolve, reject) => {
        getChannel().then(
            (channel) => {
                channel.assertQueue(QUEUE, { durable: false });
                channel.assertExchange(QUEUE, "fanout", { durable: false });
                if (channel.sendToQueue(QUEUE, new Buffer(JSON.stringify(message)))) {
                    resolve(message);
                } else {
                    reject();
                }
            },
            (error) => {
                return new Promise<IRabbitMessage>((resolve, reject) => {
                    console.log("RabbitMQ " + error);
                    reject();
                });
            });
    });
}

function getChannel(): Promise<amqp.Channel> {
    return new Promise((resolve, reject) => {
        if (channel) {
            return resolve(channel);
        }

        amqp.connect("amqp://localhost").then(
            (conn) => {
                conn.createChannel().then(
                    (chn) => {
                        console.log("RabbitMQ conectado");

                        channel = chn;
                        channel.on("close", function () {
                            console.error("RabbitMQ Conexion cerrada");
                            channel = undefined;
                        });
                        resolve(channel);
                    },
                    (onReject) => {
                        console.error("RabbitMQ " + onReject.message);
                        channel = undefined;
                        reject();
                    }
                );
            },
            (onReject) => {
                console.error("RabbitMQ " + onReject.message);
                channel = undefined;
                reject();
            });
    });
}

