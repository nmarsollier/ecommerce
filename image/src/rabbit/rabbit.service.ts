"use strict";

import amqp = require("amqplib");
import * as chalk from "chalk";
import * as security from "../utils/security";

const AUTH_QUEUE = "auth";

export interface IRabbitMessage {
    type: string;
    message: any;
}

export function init() {
    amqp.connect("amqp://localhost").then(
        (conn) => {
            conn.createChannel().then(
                (channel) => {
                    channel.on("close", function () {
                        console.log(chalk.default.red("RabbitMQ conexion cerrada"));
                        setTimeout(() => init(), 10000);
                    });

                    console.log(chalk.default.green("RabbitMQ conectado"));

                    channel.assertQueue(AUTH_QUEUE, { durable: false });
                    channel.consume(AUTH_QUEUE,
                        (message) => {
                            const rabbitMessage: IRabbitMessage = JSON.parse(message.content.toString());
                            switch (rabbitMessage.type) {
                                case "logout":
                                    security.invalidateSessionToken(rabbitMessage.message);
                            }
                        }, { noAck: true });
                },
                (onReject) => {
                    console.log(chalk.default.red("RabbitMQ error connectar con el channel"));
                    setTimeout(() => init(), 10000);
                }
            );
        },
        (onReject) => {
            console.log(chalk.default.red("RabbitMQ error al conectar"));
            setTimeout(() => init(), 10000);
        });
}
