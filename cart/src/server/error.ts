"use strict";

import * as express from "express";
import { NextFunction } from "express-serve-static-core";

export const ERROR_UNAUTHORIZED = 401;
export const ERROR_NOT_FOUND = 404;
export const ERROR_BAD_REQUEST = 400;
export const ERROR_INTERNAL_ERROR = 500;

export class ValidationErrorItem {
  path: string;
  message: string;
}
export class ValidationErrorMessage {
  code?: number;
  error?: string;
  messages?: ValidationErrorItem[];
}

export function newArgumentError(argument: string, err: string): ValidationErrorMessage {
  return {
    messages: [{
      path: argument,
      message: err
    }]
  };
}

export function newError(code: number, err: string): ValidationErrorMessage {
  return { code: code, error: err };
}

/**
 * @apiDefine ParamValidationErrors
 *
 * @apiErrorExample 400 Bad Request
 *     HTTP/1.1 400 Bad Request
 *     {
 *        "messages" : [
 *          {
 *            "path" : "{Nombre de la propiedad}",
 *            "message" : "{Motivo del error}"
 *          },
 *          ...
 *       ]
 *     }
 */

/**
 * @apiDefine OtherErrors
 *
 * @apiErrorExample 500 Server Error
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *        "error" : "Not Found"
 *     }
 *
 */
export function handle(res: express.Response, err: any): express.Response {
  if (err instanceof ValidationErrorMessage) {
    // ValidationErrorMessage
    if (err.code) {
      res.status(err.code);
    }
    return res.send({ error: err.error, messages: err.messages });
  } else if (err.code) {
    // Error de Mongo
    return res.send(sendMongoose(res, err));
  } else {
    return res.send(sendUnknown(res, err));
  }
}

// Loguea errores a la consola
export function logErrors(err: any, req: express.Request, res: express.Response, next: NextFunction) {
  if (!err) return next();

  console.error(err.message);

  res.status(err.status || ERROR_INTERNAL_ERROR);
  res.json({
    error: err.message
  });
}


export function handle404(req: express.Request, res: express.Response) {
  res.status(ERROR_NOT_FOUND);
  res.json({
    url: req.originalUrl,
    error: "Not Found"
  });
}


// Error desconocido
function sendUnknown(res: express.Response, err: any): ValidationErrorMessage {
  res.status(ERROR_INTERNAL_ERROR);
  return { error: err };
}

// Obtiene un error adecuando cuando hay errores de db
function sendMongoose(res: express.Response, err: any): ValidationErrorMessage {
  res.status(ERROR_BAD_REQUEST);

  try {
    switch (err.code) {
      case 11000:
      case 11001:
        const fieldName = err.errmsg.substring(
          err.errmsg.lastIndexOf("index:") + 7,
          err.errmsg.lastIndexOf("_1")
        );
        return {
          messages: [{
            path: fieldName,
            message: "Este registro ya existe."
          }]
        };
      default:
        res.status(ERROR_BAD_REQUEST);
        return { error: err };
    }
  } catch (ex) {
    res.status(ERROR_INTERNAL_ERROR);
    return { error: err };
  }
}
