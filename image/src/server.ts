"use strict";

import * as rabbit from "./rabbit/rabbit.service";
import * as env from "./utils/environment";
import { Config } from "./utils/environment";
import * as express from "./utils/express";


// Variables de entorno
const conf: Config = env.getConfig(process.env);

// Mejoramos el log de las promesas
process.on("unhandledRejection", (reason, p) => {
  console.error("Unhandled Rejection at: Promise", p, "reason:", reason);
});

// Se configura e inicia express
const app = express.init(conf);

rabbit.init();

app.listen(conf.port, () => {
  console.log(`Image Server escuchando en puerto ${conf.port}`);
});

module.exports = app;
