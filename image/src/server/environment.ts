"use strict";

import * as dotenv from "dotenv";

let config: Config;

/*
Todas las configuraciones del servidor se encuentran en este modulo, si se quien
acceder desde cualquier parte del sistema, se deben acceder llamando a este método.
*/
export function getConfig(environment: any): Config {
  if (!config) {
    // El archivo .env es un archivo que si esta presente se leen las propiedades
    // desde ese archivo, sino se toman estas de aca para entorno dev.
    // .env es un archivo que no se debería subir al repositorio y cada server debería tener el suyo
    dotenv.config({ path: ".env" });

    config = {
      port: process.env.SERVER_PORT || "3001",
      logLevel: process.env.LOG_LEVEL || "debug",
      redisHost: process.env.REDIS_HOST || "127.0.0.1",
      redisPort: Number(process.env.REDIS_PORT || "6379"),
      securityServer: process.env.SECURITY_SERVER || "http://localhost:3000",
      rabbitUrl: process.env.SECURITY_SERVER || "amqp://localhost"
    };
  }
  return config;
}

export interface Config {
  port: string;
  logLevel: string; // 'debug' | 'verbose' | 'info' | 'warn' | 'error';
  redisHost: string;
  redisPort: number;
  securityServer: string;
  rabbitUrl: string;
}
