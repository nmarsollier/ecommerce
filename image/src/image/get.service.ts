"use strict";

import { NextFunction } from "express-serve-static-core";
import { Express } from "express";
import { IImage } from "./types";

import * as error from "../utils/error";
import * as express from "express";
import * as escape from "escape-html";
import * as jimp from "jimp";
import * as chalk from "chalk";
import * as redis from "../utils/redis";

/**
 * @api {get} /image/:id Get Image
 * @apiName GetImage
 * @apiGroup Image
 *
 * @apiDescription Get Image
 *
 * @apiUse AuthHeader
 * @apiUse SizeHeader
 *
 * @apiSuccessExample {json} Response
 *    {
 *      "id": "5e813570-6026-11e8-a038-f19c597ba92a",
 *      "image" : "Base 64 Image Text"
 *    }
 *
 * @apiUse ParamValidationErrors
 * @apiUse OtherErrors
 * @apiUse Unautorized
 */
export interface IReadRequest extends express.Request {
  image: IImage;
}
export function read(req: IReadRequest, res: express.Response) {
  res.json(req.image);
}

export function findByID(req: IReadRequest, res: express.Response, next: NextFunction, id: string) {
  // Buscamos la imagen de acuerdo a lo solicitado en el header, si no se encuentra y se
  // esta pidiendo un tamaño en particular que no se tiene, se reajusta el tamaño

  const size = escape(req.header("Size"));
  const newSize = getSize(size);
  let imageId = escape(id);
  if (newSize > 0) {
    imageId = imageId + "_" + size;
  }

  redis.getClient().get(imageId, function (err, reply) {
    if (err) return error.handleError(res, err);

    if (!reply) {
      if (newSize > 0) {
        return findAndResize(req, res, next, id);
      } else {
        return error.sendError(res, error.ERROR_NOT_FOUND, id + " not found");
      }
    }

    req.image = {
      id: escape(id),
      image: reply
    };
    next();
  });
}

/*
* Solo llamamos a esta funcion si estamos seguros de que hay que ajustarle el tamaño,
* o sea que el header size contiene un valor adecuado y que no lo temenos ya generado en redis
*/
function findAndResize(req: IReadRequest, res: express.Response, next: NextFunction, id: string) {
  const size = escape(req.header("Size"));

  redis.getClient().get(escape(id), function (err, reply) {
    if (err) return error.handleError(res, err);

    if (!reply) {
      return error.sendError(res, error.ERROR_NOT_FOUND, id + " not found");
    }

    const image: IImage = {
      id: escape(id),
      image: reply
    };

    resizeImage(image, size).then(
      (result) => {
        redis.getClient().set(result.id, result.image, function (err: any, reply: any) {
          if (err) {
            req.image = image;
            next();
          }
          req.image = result;
          next();
        });
      },
      (error) => {
        console.log(chalk.default.red("Error al reajustar tamaño de imagen"));

        req.image = image;
        next();
      }
    );
  });
}

/**
 * @apiDefine SizeHeader
 *
 * @apiParamExample {String} Size Header
 *    Size=[thumb|medium|large|original]
 */
function resizeImage(image: IImage, size: string): Promise<IImage> {
  const newSize = getSize(size);

  return new Promise((resolve, reject) => {
    jimp.read(
      Buffer.from(image.image.substring(image.image.indexOf(",") + 1), "base64")
    ).then(
      (loadedImage) => {
        if (loadedImage.bitmap.width > newSize || loadedImage.bitmap.height > newSize) {
          loadedImage.scaleToFit(newSize, newSize)
            .quality(60);
        }

        loadedImage.getBuffer(jimp.MIME_JPEG, (err, buffer) => {
          if (err) {
            reject();
          }
          const result: IImage = {
            id: image.id + "_" + size,
            image: "data:image/jpeg;base64," + buffer.toString("base64")
          };

          resolve(result);
        });
      },
      (error) => {
        reject();
      }
    );
  });
}

/*
 * A partir del header size obtiene el tamaño de imagen adecuado
 * 0 == original
 */
function getSize(sizeHeader: string): number {
  switch (sizeHeader) {
    case "thumb": {
      return 320;
    }
    case "medium": {
      return 800;
    }
    case "large": {
      return 1024;
    }
  }
  return 0;
}