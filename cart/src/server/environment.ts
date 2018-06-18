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
    // .env es un archivo que no se debería subir al repo y cada server debería tener el suyo
    dotenv.config({ path: ".env" });

    config = {
      port: process.env.SERVER_PORT || "3003",
      logLevel: process.env.LOG_LEVEL || "debug",
      mongoDb: process.env.MONGODB || "mongodb://localhost/cart",
      securityServer: process.env.SECURITY_SERVER || "http://localhost:3000",
      catalogServer: process.env.SECURITY_SERVER || "http://localhost:3002",
      rabbitUrl: process.env.RABBIT_URL || "amqp://localhost"
    };
  }
  return config;
}

export interface Config {
  port: string;
  logLevel: string; // 'debug' | 'verbose' | 'info' | 'warn' | 'error';
  mongoDb: string;
  securityServer: string;
  catalogServer: string;
  rabbitUrl: string;
}
