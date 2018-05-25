"use strict";

import { Express } from "express";
import * as image from "./image.service";
import * as securityService from "../security/security.service";

export function init(app: Express) {
  // Routas de acceso a mascotas
  app
    .route("/image")
    .post(securityService.validateSesssionToken, image.validateCreate, image.create);

  app
    .route("/image/:imageId")
    .get(securityService.validateSesssionToken, image.read);

  // Filtro que agrega la mascota cuando se pasa como parametro el id
  app.param("imageId", image.findByID);
}
