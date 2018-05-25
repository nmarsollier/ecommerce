"use strict";

import amqp = require("amqplib");
import * as chalk from "chalk";
import { IUserSession } from "../security/security.service";

export interface IRabbitMessage {
    type: string;
    message: any;
}

export function sendLogout(token: string): Promise<IRabbitMessage> {
    return sendMessage("auth", {
        type: "logout",
        message: token
    });
}

function sendMessage(queue: string, message: IRabbitMessage): Promise<IRabbitMessage> {
    return new Promise((resolve, reject) => {
        amqp.connect("amqp://localhost").then(
            (conn) => {
                conn.createChannel().then(
                    (channel) => {
                        channel.assertQueue(queue, { durable: false });
                        if (channel.sendToQueue(queue, new Buffer(JSON.stringify(message)))) {
                            resolve(message);
                        } else {
                            reject();
                        }
                    },
                    (onReject) => {
                        console.log(chalk.default.red("RabbitMQ Fallo al crear channel"));
                        reject(onReject);
                    }
                );
            },
            (onReject) => {
                console.log(chalk.default.red("RabbitMQ Fallo al conectar"));
                reject(onReject);
            });
    });
}
