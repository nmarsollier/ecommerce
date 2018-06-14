"use strict";

import { Express } from "express";
import * as security from "../utils/security";
import * as createService from "./create.service";
import * as getService from "./get.service";

export function init(app: Express) {
  app
    .route("/v1/image")
    .post(security.validateSessionToken, createService.validateCreate, createService.create);

  app
    .route("/v1/image/:imageId")
    .get(security.validateSessionToken, getService.findById, getService.read);

  app
    .route("/v1/image/:imageId/jpeg")
    .get(security.validateSessionToken, getService.findById, getService.readJpeg);
}
