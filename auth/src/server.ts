"use strict";

import { Express } from "express";
import { Config } from "./utils/environment";
import { MongoError } from "mongodb";

import * as express from "./utils/express";
import * as env from "./utils/environment";
import * as mongoose from "mongoose";

// Variables de entorno
const conf: Config = env.getConfig(process.env);

// Mejoramos el log de las promesas
process.on("unhandledRejection", (reason, p) => {
  console.error("Unhandled Rejection at: Promise", p, "reason:", reason);
});

// Establecemos conexión con MongoDD
mongoose.connect(conf.mongoDb, {}, function (err: MongoError) {
  if (err) {
    console.error("No se pudo conectar a MongoDB!");
    console.error(err.message);
    process.exit();
  } else {
    console.log("MongoDB conectado.");
  }
});

// Se configura e inicia express
const app = express.init(conf);

app.listen(conf.port, () => {
  console.log(`Server escuchando en puerto ${conf.port}`);
});

module.exports = app;
