"use strict";

import { Express } from "express";
import * as createService from "./create.service";
import * as getService from "./get.service";
import * as security from "../utils/security";

export function init(app: Express) {
  app
    .route("/image")
    .post(security.validateSesssionToken, createService.validateCreate, createService.create);

  app
    .route("/image/:imageId")
    .get(security.validateSesssionToken, getService.findById, getService.read);

    app
    .route("/image/:imageId/jpeg")
    .get(security.validateSesssionToken, getService.findById, getService.readJpeg);
}
