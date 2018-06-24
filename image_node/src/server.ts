"use strict";

import * as logoutService from "./rabbit/logoutService";
import * as env from "./server/environment";
import { Config } from "./server/environment";
import * as express from "./server/express";


// Variables de entorno
const conf: Config = env.getConfig(process.env);

// Mejoramos el log de las promesas
process.on("unhandledRejection", (reason, p) => {
  console.error("Unhandled Rejection at: Promise", p, "reason:", reason);
});

// Se configura e inicia express
const app = express.init(conf);

logoutService.init();

app.listen(conf.port, () => {
  console.log(`Image Server escuchando en puerto ${conf.port}`);
});

module.exports = app;
