"use strict";

import { Express } from "express";
import * as image from "./image.service";
import * as securityService from "../security/security.service";

export function init(app: Express) {
  app
    .route("/image")
    .post(securityService.validateSesssionToken, image.validateCreate, image.create);

  app
    .route("/image/:imageId")
    .get(securityService.validateSesssionToken, image.read);

  app.param("imageId", image.findByID);
}
