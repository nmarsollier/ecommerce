"use strict";

import * as express from "express";
import { NextFunction } from "express-serve-static-core";
import * as uuid from "uuid/v1";
import * as error from "../utils/error";
import * as redis from "../utils/redis";
import { IImage } from "./types";


/**
 * @api {post} /image Crear Imagen
 * @apiName CreateImage
 * @apiGroup Imagen
 *
 * @apiDescription Agrega una nueva imagen al servidor.
 *
 *
 * @apiParamExample {json} Body
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
export async function validateCreate(req: express.Request, res: express.Response, next: NextFunction) {
  req.check("image", "Debe especificar la imagen.").isLength({ min: 1 });
  req.check("image", "Imagen invalida").contains("data:image/");

  const result = await req.getValidationResult();
  if (!result.isEmpty()) {
    return error.handleExpressValidationError(res, result);
  }
  next();
}

export function create(req: express.Request, res: express.Response) {
  const image: IImage = {
    id: uuid(),
    image: req.body.image
  };

  redis.getClient().set(image.id, image.image, function (err: any, reply: any) {
    if (err) {
      return error.handleError(res, err);
    }

    res.json({ id: image.id });
  });
}
