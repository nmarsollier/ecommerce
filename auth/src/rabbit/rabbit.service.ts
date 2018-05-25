"use strict";

import amqp = require("amqplib");
import * as chalk from "chalk";
import { IUserSession } from "../security/security.service";

export interface IRabbitMessage {
    type: string;
    message: any;
}
const QUEUE = "auth";
let channel: amqp.Channel;

/**
 * @api {sendToQueue} auth InvalidatedToken
 * @apiGroup RabbitMQ
 *
 * @apiDescription Security service notifies to all subscribbers that a session token has been invalidated, consumers should also invalidate the token.
 *
 * @apiSuccessExample {json} Message
 *     {
 *        "type": "logout",
 *        "message": "{token}"
 *     }
 */
export function sendLogout(token: string): Promise<IRabbitMessage> {
    return sendMessage({
        type: "logout",
        message: token
    });
}

function init(): Promise<amqp.Channel> {
    return new Promise((resolve, reject) => {
        amqp.connect("amqp://localhost").then(
            (conn) => {
                console.log(chalk.default.green("RabbitMQ conectado"));

                conn.createChannel().then(
                    (chn) => {
                        console.log(chalk.default.green("RabbitMQ Canal creado"));

                        channel = chn;
                        channel.on("close", function () {
                            console.log(chalk.default.red("RabbitMQ Conexion cerrada"));
                            channel = undefined;
                        });
                        resolve(channel);
                    },
                    (onReject) => {
                        console.log(chalk.default.red("RabbitMQ Fallo al crear channel"));
                        channel = undefined;
                        reject();
                    }
                );
            },
            (onReject) => {
                console.log(chalk.default.red("RabbitMQ Fallo al conectar"));
                channel = undefined;
                reject();
            });
    });
}

function sendMessage(message: IRabbitMessage): Promise<IRabbitMessage> {
    return new Promise<IRabbitMessage>((resolve, reject) => {
        if (channel) {
            channel.assertQueue(QUEUE, { durable: false });

            if (channel.sendToQueue(QUEUE, new Buffer(JSON.stringify(message)))) {
                resolve(message);
            } else {
                reject();
            }
        } else {
            init().then(
                (channel) => {
                    channel.assertQueue(QUEUE, { durable: false });

                    if (channel.sendToQueue(QUEUE, new Buffer(JSON.stringify(message)))) {
                        resolve(message);
                    } else {
                        reject();
                    }
                },
                (error) => {
                    return new Promise<IRabbitMessage>((resolve, reject) => {
                        reject();
                    });
                });
        }

    });
}
