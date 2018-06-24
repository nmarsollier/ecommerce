"use strict";

import { NextFunction } from "connect";
import * as express from "express";
import { Express } from "express";
import * as image from "../image";
import * as token from "../token";
import * as error from "./error";

export function init(app: Express) {
  app.route("/v1/image").post(validateToken, create);

  app.route("/v1/image/:imageId").get(findById);

  app.route("/v1/image/:imageId/jpeg").get(findJpegById);
}

interface IUserSessionRequest extends express.Request {
  user: token.ISession;
}

/**
 * @apiDefine AuthHeader
 *
 * @apiExample {String} Header Autorización
 *    Authorization=bearer {token}
 *
 * @apiErrorExample 401 Unauthorized
 *    HTTP/1.1 401 Unauthorized
 */
function validateToken(req: IUserSessionRequest, res: express.Response, next: NextFunction) {
  const auth = req.header("Authorization");
  if (!auth) {
    return error.handle(res, error.newError(error.ERROR_UNAUTHORIZED, "Unauthorized"));
  }

  token.validate(auth)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => error.handle(res, err));
}

/**
 * @api {post} /v1/image Crear Imagen
 * @apiName Crear Imagen
 * @apiGroup Imagen
 *
 * @apiDescription Agrega una nueva imagen al servidor.
 *
 * @apiExample {json} Body
 *    {
 *      "image" : "{Imagen en formato Base 64}"
 *    }
 *
 * @apiSuccessExample {json} Respuesta
 *     HTTP/1.1 200 OK
 *     {
 *       "id": "{Id de imagen}"
 *     }
 *
 * @apiUse AuthHeader
 * @apiUse ParamValidationErrors
 * @apiUse OtherErrors
 */
function create(req: IUserSessionRequest, res: express.Response, next: NextFunction) {
  image.create(req.body)
    .then(id => res.json({ id: id }))
    .catch(err => error.handle(res, err));
}

/**
 * @api {get} /v1/image/:id/jpeg Obtener Imagen Jpeg
 * @apiName Obtener Imagen Jpeg
 * @apiGroup Imagen
 *
 * @apiDescription Obtiene una imagen del servidor en formato jpeg.
 *
 * @apiUse SizeHeader
 *
 * @apiSuccessExample Respuesta
 *    Imagen en formato jpeg
 *
 * @apiUse AuthHeader
 * @apiUse ParamValidationErrors
 * @apiUse OtherErrors
 */
function findJpegById(req: express.Request, res: express.Response) {
  const id = escape(req.params.imageId);
  const sizeHeader = req.header("Size") || req.query.Size;
  image.findById(id, sizeHeader)
    .then(image => {
      const data = image.image.substring(image.image.indexOf(",") + 1);
      const buff = new Buffer(data, "base64");
      res.type("image/jpeg");
      res.send(buff);
    })
    .catch(err => error.handle(res, err));
}

/**
 * @api {get} /v1/image/:id Obtener Imagen
 * @apiName Obtener Imagen
 * @apiGroup Imagen
 *
 * @apiDescription Obtiene una imagen del servidor en formato base64
 *
 * @apiUse SizeHeader
 *
 * @apiSuccessExample {json} Respuesta
 *    {
 *      "id": "{Id de imagen}",
 *      "image" : "{Imagen en formato Base 64}"
 *    }
 *
 * @apiUse AuthHeader
 * @apiUse ParamValidationErrors
 * @apiUse OtherErrors
 */
function findById(req: express.Request, res: express.Response) {
  const id = escape(req.params.imageId);
  const sizeHeader = req.header("Size") || req.query.Size;
  image.findById(id, sizeHeader)
    .then(image => res.json(image))
    .catch(err => error.handle(res, err));
}