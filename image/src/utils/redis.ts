"use strict";
import * as redis from "ioredis";
import * as appConfig from "../utils/environment";

const conf = appConfig.getConfig(process.env);
let redisClient: redis.Redis;

export function getClient() {
    if (!redisClient) {
        redisClient = new redis(conf.redisPort, conf.redisHost);
        redisClient.on("connect", function () {
            console.log("Redis conectado");
        });
        redisClient.on("end", function () {
            redisClient = undefined;
            console.error("Redis desconectado");
        });
    }
    return redisClient;
}
