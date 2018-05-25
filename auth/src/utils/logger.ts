"use strict";

import * as winston from "winston";
import * as config from "../utils/environment";

export let logger: winston.LoggerInstance;

export function getLogger(): winston.LoggerInstance {
  if (!logger) {
    logger = new winston.Logger({
      transports: [
        new winston.transports.Console({
          level: config.getConfig(process.env).logLevel,
          raw: true
        })
      ]
    });
  }

  return logger;
}
