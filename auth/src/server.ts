"use strict";

import { Express } from "express";
import { Config } from "./utils/environment";
import * as expressApp from "./utils/express.factory";
import * as appConfig from "./utils/environment";
import * as loggerFactory from "./utils/logger";
import * as mongoose from "mongoose";
import * as chalk from "chalk";
import { MongoError } from "mongodb";

// Variables de entorno
const conf: Config = appConfig.getConfig(process.env);

// Establecemos conexion con MongoDD
mongoose.connect(conf.mongoDb, {}, function (err: MongoError) {
  if (err) {
    console.error(chalk.default.red("No se pudo conectar a MongoDB!"));
    console.log(chalk.default.red(err.message));
    process.exit();
  }
});

// Se configura e inicializa express
const app = expressApp.init(conf);

app.listen(conf.port, () => {
  console.log(chalk.default.green(`Mascotas Server escuchando en puerto ${conf.port}`));
});

module.exports = app;
