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
    .get(security.validateSesssionToken, getService.read);

  app.param("imageId", getService.findByID);
}
