"use strict";

import * as dotenv from "dotenv";

let config: Config;

/*
Todas las configuraciones del servidor se encuentran en este modulo, si se quien
acceder desde cualquier parte del sistema, se deben acceder llamando a este metodo.
*/
export function getConfig(environment: any): Config {
  if (!config) {
    // El archivo .env es un archivo que si esta presente se leen las propiedades
    // desde ese archivo, sino se toman estas de aca para entorno dev.
    // .env es un archivo que no se deberia subir al repo y cada server deberia tener el suyo
    dotenv.config({ path: ".env" });

    config = {
      port: process.env.SERVER_PORT || "3001",
      redisHost: process.env.REDIS_HOST || "127.0.0.1",
      redisPort: Number(process.env.REDIS_PORT || "6379"),
      securityServer: process.env.SECURITY_SERVER || "http://localhost:3000",
    };
  }
  return config;
}

export interface Config {
  port: string;
  redisHost: string;
  redisPort: number;
  securityServer: string;
}
