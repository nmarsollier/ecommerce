"use strict";

import { Config } from "./utils/environment";

import * as express from "./utils/express";
import * as env from "./utils/environment";
import * as rabbbit from "./rabbit/rabbit.get.service";
import * as mongoose from "mongoose";
import { MongoError } from "mongodb";

// Variables de entorno
const conf: Config = env.getConfig(process.env);


// Mejoramos el log de las promesas
process.on("unhandledRejection", (reason, p) => {
  console.error("Unhandled Rejection at: Promise", p, "reason:", reason);
});

// Establecemos conexion con MongoDD
mongoose.connect(conf.mongoDb, {}, function (err: MongoError) {
  if (err) {
    console.error("No se pudo conectar a MongoDB!");
    console.error(err.message);
    process.exit();
  } else {
    console.log("MongoDB conectado.");
  }
});

// Se configura e inicializa express
const app = express.init(conf);

rabbbit.init();

app.listen(conf.port, () => {
  console.log(`Cart Server escuchando en puerto ${conf.port}`);
});

module.exports = app;
