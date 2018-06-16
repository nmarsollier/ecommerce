"use strict";

import * as escape from "escape-html";
import * as express from "express";
import { NextFunction } from "express-serve-static-core";
import * as jimp from "jimp";
import * as error from "../utils/error";
import * as redis from "../utils/redis";
import { IImage } from "./types";


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
export interface IReadRequest extends express.Request {
  image: IImage;
}
export function read(req: IReadRequest, res: express.Response) {
  res.json(req.image);
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
export function readJpeg(req: IReadRequest, res: express.Response) {
  jimp.read(
    Buffer.from(req.image.image.substring(req.image.image.indexOf(",") + 1), "base64")
  ).then(
    (loadedImage) => {
      let contentType = req.image.image.substring(0, req.image.image.indexOf(";"));
      contentType = contentType.substring(req.image.image.indexOf(":") + 1);

      loadedImage.quality(60);

      loadedImage.getBuffer("image/jpeg", (err, buffer) => {
        if (err) {
          return error.sendError(res, error.ERROR_INTERNAL_ERROR, "Cannot load image.");
        }

        res.contentType(contentType);
        res.send(buffer);
      });
    }
  ).catch(
    (exception) => {
      return error.sendError(res, error.ERROR_INTERNAL_ERROR, "Cannot load image.");
    }
  );
}


export async function findById(req: IReadRequest, res: express.Response, next: NextFunction) {
  const id = escape(req.params.imageId);

  // Buscamos la imagen de acuerdo a lo solicitado en el header, si no se encuentra y se
  // esta pidiendo un tamaño en particular que no se tiene, se reajusta el tamaño

  const size = escape(req.header("Size"));
  const newSize = getSize(size);
  let imageId = escape(id);
  if (newSize > 0) {
    imageId = imageId + "_" + size;
  }

  try {
    const reply = await redis.getRedisDocument(imageId);
    req.image = {
      id: escape(id),
      image: reply
    };

    next();
  } catch (err) {
    if (err) return error.handleError(res, err);

    if (newSize > 0) {
      return findAndResize(req, res, next, id);
    } else {
      return error.sendError(res, error.ERROR_NOT_FOUND, id + " not found");
    }
  }
}

/*
* Solo llamamos a esta función si estamos seguros de que hay que ajustarle el tamaño,
* o sea que el header size contiene un valor adecuado y que no lo tenemos ya generado en redis
*/
async function findAndResize(req: IReadRequest, res: express.Response, next: NextFunction, id: string) {
  const size = escape(req.header("Size"));

  try {
    const data = await redis.getRedisDocument(escape(id));

    const image: IImage = {
      id: escape(id),
      image: data
    };

    try {
      const result = await resizeImage(image, size);
      await redis.setRedisDocument(result.id, result.image);

      req.image = result;
      next();
    } catch (_) {
      console.error("Error al reajustar tamaño de imagen");

      req.image = image;
      next();
    }
  } catch (err) {
    if (!err) {
      return error.sendError(res, error.ERROR_NOT_FOUND, id + " not found");
    }
    return error.handleError(res, err);
  }
}

/**
 * @apiDefine SizeHeader
 *
 * @apiExample {String} Header Size
 *    Size=[160|320|640|800|1024|1200]
 */
function resizeImage(image: IImage, size: string): Promise<IImage> {
  const newSize = getSize(size);

  return new Promise((resolve, reject) => {
    jimp.read(
      Buffer.from(image.image.substring(image.image.indexOf(",") + 1), "base64")
    ).then(
      (loadedImage) => {
        if (loadedImage.bitmap.width > newSize || loadedImage.bitmap.height > newSize) {
          loadedImage.scaleToFit(newSize, newSize);
        }
        loadedImage.quality(60);

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
      (err) => reject()
    );
  });
}

/*
 * A partir del header size obtiene el tamaño de imagen adecuado
 * 0 == original
 */
function getSize(sizeHeader: string): number {
  switch (sizeHeader) {
    case "160": {
      return 160;
    }
    case "320": {
      return 320;
    }
    case "640": {
      return 640;
    }
    case "800": {
      return 800;
    }
    case "1024": {
      return 1024;
    }
    case "1200": {
      return 1200;
    }
  }
  return 0;
}