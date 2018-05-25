"use strict";

import amqp = require("amqplib");
import * as chalk from "chalk";
import * as securityService from "../security/security.service";
import { ISession } from "../security/security.service";

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
                        console.log(chalk.default.red("RabbitMQ Conexion cerrada"));
                        setTimeout(() => init(), 10000);
                    });

                    console.log(chalk.default.green("RabbitMQ conectado al canal"));

                    channel.assertQueue(AUTH_QUEUE, { durable: false });
                    channel.consume(AUTH_QUEUE,
                        (message) => {
                            const rabbitMessage: IRabbitMessage = JSON.parse(message.content.toString());
                            switch (rabbitMessage.type) {
                                case "logout":
                                    securityService.invalidateSessionToken(rabbitMessage.message);
                            }
                        }, { noAck: true });
                },
                (onReject) => {
                    console.log(chalk.default.red("RabbitMQ Fallo al connectar con el channel"));
                    setTimeout(() => init(), 10000);
                }
            );
        },
        (onReject) => {
            console.log(chalk.default.red("RabbitMQ Fallo al conectar"));
            setTimeout(() => init(), 10000);
        });
}
