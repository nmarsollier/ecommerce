"use strict";
import * as appConfig from "../utils/environment";
import * as redis from "ioredis";
import * as chalk from "chalk";

const conf = appConfig.getConfig(process.env);
let redisClient: redis.Redis;

export function getClient() {
    if (!redisClient) {
        redisClient = new redis(conf.redisPort, conf.redisHost);
        redisClient.on("connect", function () {
            console.log(chalk.default.green("Redis conectado"));
        });
        redisClient.on("end", function () {
            redisClient = undefined;
            console.log(chalk.default.red("Redis desconectado"));
        });
    }
    return redisClient;
}
