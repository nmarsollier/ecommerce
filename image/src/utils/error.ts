"use strict";

import * as express from "express";
import { NextFunction } from "express-serve-static-core";
import { Result } from "express-validator/check";

export const ERROR_UNAUTHORIZED = 401;
export const ERROR_NOT_FOUND = 404;
export const ERROR_BAD_REQUEST = 400;
export const ERROR_INTERNAL_ERROR = 500;

export interface ValidationErrorItem {
  path: string;
  message: string;
}
export interface ValidationErrorMessage {
  error?: string;
  messages?: ValidationErrorItem[];
}

// Error desconocido
function processUnknownError(res: express.Response, err: any): ValidationErrorMessage {
  res.status(ERROR_INTERNAL_ERROR);
  res.setHeader("X-Status-Reason", "Unknown error");
  return { error: err };
}

// Error de validación de datos
function processValidationError(res: express.Response, err: any): ValidationErrorMessage {
  res.status(ERROR_BAD_REQUEST);
  res.setHeader("X-Status-Reason", "Validation failed");
  const messages: ValidationErrorItem[] = [];
  for (const key in err.errors) {
    messages.push({
      path: key,
      message: err.errors[key].message
    });
  }
  return {
    messages: messages
  };
}

/**
 * @apiDefine ParamValidationErrors
 *
 * @apiSuccessExample {json} 400 Bad Request
 *     HTTP/1.1 400 Bad Request
 *     HTTP/1.1 Header X-Status-Reason: {Mensaje}
 *     {
 *        "messages" : [
 *          {
 *            "path" : "{Propiedad con errores}",
 *            "message" : "{Mensaje con el error}"
 *          },
 *          ...
 *       ]
 *     }
 */

/**
 * @apiDefine OtherErrors
 *
 * @apiSuccessExample {json} 404 Not Found
 *     HTTP/1.1 404 Not Found
 *     HTTP/1.1 Header X-Status-Reason: {Mensaje}
 *     {
 *        "url" : "{Url no encontrada}",
 *        "error" : "Not Found"
 *     }
 *
 * @apiSuccessExample {json} 500 Server Error
 *     HTTP/1.1 500 Internal Server Error
 *     HTTP/1.1 Header X-Status-Reason: {Mensaje}
 *     {
 *        "error" : "Not Found"
 *     }
 */
export function handleError(res: express.Response, err: any): express.Response {
  if (err.errors) {  // ValidationError
    return res.send(processValidationError(res, err));
  } else {
    return res.send(processUnknownError(res, err));
  }
}

export function sendError(res: express.Response, code: number, err: string) {
  res.status(code);
  res.setHeader("X-Status-Reason", err);
  return res.send({ error: err });
}

export function handleExpressValidationError(res: express.Response, err: Result): express.Response {
  res.status(ERROR_BAD_REQUEST);
  res.setHeader("X-Status-Reason", "Validation failed");
  const messages: ValidationErrorItem[] = [];
  for (const error of err.array({ onlyFirstError: true })) {
    messages.push({
      path: error.param,
      message: error.msg
    });
  }
  return res.send({ message: messages });
}

// Controla errores
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
  res.setHeader("X-Status-Reason", "Not found");
  res.json({
    url: req.originalUrl,
    error: "Not Found"
  });
}
