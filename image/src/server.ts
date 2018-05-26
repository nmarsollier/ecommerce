"use strict";

import { Express } from "express";
import { Config } from "./utils/environment";

import * as express from "./utils/express";
import * as env from "./utils/environment";
import * as chalk from "chalk";
import * as rabbbit from "./rabbit/rabbit.service";

// Variables de entorno
const conf: Config = env.getConfig(process.env);

// Se configura e inicializa express
const app = express.init(conf);

rabbbit.init();

app.listen(conf.port, () => {
  console.log(chalk.default.green(`Image Server escuchando en puerto ${conf.port}`));
});

module.exports = app;
