"use strict";

import { Express } from "express";
import * as security from "../utils/security";
import * as createService from "./create.service";
import * as getService from "./get.service";

export function init(app: Express) {
  app
    .route("/image")
    .post(security.validateSessionToken, createService.validateCreate, createService.create);

  app
    .route("/image/:imageId")
    .get(security.validateSessionToken, getService.findById, getService.read);

  app
    .route("/image/:imageId/jpeg")
    .get(security.validateSessionToken, getService.findById, getService.readJpeg);
}
