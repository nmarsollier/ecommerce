"use strict";

import * as uuid from "uuid/v1";
import * as error from "../server/error";
import * as redis from "../server/redis";
import { IImage } from "./schema";

interface ImageRequest {
  image: string;
}

export async function create(body: ImageRequest): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    validateCreate(body)
      .then(body => {
        const image: IImage = {
          id: uuid(),
          image: body.image
        };

        redis.setRedisDocument(image.id, image.image)
          .then(id => resolve(id))
          .catch(err => reject(err));
      })
      .catch(err => reject(err));
  });
}

function validateCreate(body: ImageRequest): Promise<ImageRequest> {
  const result: error.ValidationErrorMessage = {
    messages: []
  };

  if (!body.image) {
    result.messages.push({ path: "image", message: "No puede quedar vacío." });
  }

  if (body.image.indexOf("data:image/") < 0) {
    result.messages.push({ path: "image", message: "Imagen invalida" });
  }

  if (result.messages.length > 0) {
    return Promise.reject(result);
  }
  return Promise.resolve(body);
}
