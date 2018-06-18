"use strict";

import * as escape from "escape-html";
import * as jimp from "jimp";
import * as error from "../server/error";
import * as redis from "../server/redis";
import { IImage } from "./schema";

export async function findById(id: string, sizeHeader: string): Promise<IImage> {
  // Buscamos la imagen de acuerdo a lo solicitado en el header, si no se encuentra y se
  // esta pidiendo un tamaño en particular que no se tiene, se reajusta el tamaño
  const newSize = getSize(sizeHeader);
  let imageId = escape(id);
  if (newSize > 0) {
    imageId = imageId + "_" + sizeHeader;
  }

  try {
    const reply = await redis.getRedisDocument(imageId);
    return Promise.resolve({
      id: escape(id),
      image: reply
    });
  } catch (err) {
    if (err) return Promise.reject(err);

    if (newSize > 0) {
      return findAndResize(id, sizeHeader);
    } else {
      return Promise.reject(error.newError(error.ERROR_NOT_FOUND, id + " not found"));
    }
  }
}

/*
* Solo llamamos a esta función si estamos seguros de que hay que ajustarle el tamaño,
* o sea que el header size contiene un valor adecuado y que no lo tenemos ya generado en redis
*/
async function findAndResize(id: string, sizeHeader: string): Promise<IImage> {
  const size = escape(sizeHeader);

  try {
    const data = await redis.getRedisDocument(escape(id));

    const image: IImage = {
      id: escape(id),
      image: data
    };

    try {
      const result = await resizeImage(image, size);
      await redis.setRedisDocument(result.id, result.image);

      return Promise.resolve(result);
    } catch (_) {
      console.error("Error al reajustar tamaño de imagen");

      return Promise.resolve(image);
    }
  } catch (err) {
    if (!err) {
      return Promise.reject(error.newError(error.ERROR_NOT_FOUND, id + " not found"));
    }
    return Promise.reject(err);
  }
}

/**
 * @apiDefine SizeHeader
 *
 * @apiExample {String} Size : Parametro url o header
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