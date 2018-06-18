"use strict";
import * as redis from "ioredis";
import * as appConfig from "./environment";

const conf = appConfig.getConfig(process.env);
let redisClient: redis.Redis;

export function getRedisDocument(id: string): Promise<string> {
    return new Promise((resolve, reject) => {
        getClient().get(escape(id), function (err, reply) {
            if (err) reject(err);

            if (!reply) reject(undefined);

            resolve(reply);
        });
    });
}


export function setRedisDocument(id: string, image: string): Promise<string> {
    return new Promise((resolve, reject) => {
        getClient().set(id, image, function (err: any, reply: any) {
            if (err) reject(err);
            resolve(id);
        });
    });
}

function getClient() {
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
