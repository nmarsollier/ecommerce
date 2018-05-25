"use strict";

import * as express from "express";
import * as expressValidator from "express-validator";
import { Result } from "express-validator/shared-typings";
import { NextFunction } from "express-serve-static-core";

export const ERROR_UNATORIZED = 401;
export const ERROR_NOT_FOUND = 404;
export const ERROR_UNAUTORIZED_METHOD = 405;
export const ERROR_BAD_REQUEST = 400;
export const ERROR_INTERNAL_ERROR = 500;

export interface ValidationErrorItem {
  path: string;
  message: string;
}
export interface ValidationErrorMessage {
  error?: string;
  message?: ValidationErrorItem[];
}

// Error desconocido
function processUnknownError(res: express.Response, err: any): ValidationErrorMessage {
  res.status(ERROR_INTERNAL_ERROR);
  res.header("X-Status-Reason: Unknown error");
  return { error: err };
}

// Obtiene un error adecuando cuando hay errores de db
function processMongooseErrorCode(res: express.Response, err: any): ValidationErrorMessage {
  res.status(ERROR_BAD_REQUEST);

  try {
    switch (err.code) {
      case 11000:
      case 11001:
        res.header("X-Status-Reason: Unique constraint");

        const fieldName = err.errmsg.substring(
          err.errmsg.lastIndexOf("index:") + 7,
          err.errmsg.lastIndexOf("_1")
        );
        return {
          message: [{
            path: fieldName,
            message: "Este registro ya existe."
          }]
        };
      default:
        res.status(ERROR_BAD_REQUEST);
        res.header("X-Status-Reason: Unknown database error code:" + err.code);
        return { error: err };
    }
  } catch (ex) {
    res.status(ERROR_INTERNAL_ERROR);
    res.header("X-Status-Reason: Unknown database error");
    return { error: err };
  }
}

// Error de validacion de datos
function processValidationError(res: express.Response, err: any): ValidationErrorMessage {
  res.header("X-Status-Reason: Validation failed");
  res.status(ERROR_BAD_REQUEST);
  const messages: ValidationErrorItem[] = [];
  for (const key in err.errors) {
    messages.push({
      path: key,
      message: err.errors[key].message
    });
  }
  return {
    message: messages
  };
}

export function handleError(res: express.Response, err: any): express.Response {
  if (err.code) {   // Database Error
    return res.send(processMongooseErrorCode(res, err));
  } else if (err.errors) {  // ValidationError
    return res.send(processValidationError(res, err));
  } else {
    return res.send(processUnknownError(res, err));
  }
}

export function sendError(res: express.Response, code: number, err: string) {
  res.status(code);
  res.header("X-Status-Reason: " + err);
  return res.send({ error: err });
}


export function handleExpressValidationError(res: express.Response, err: Result): express.Response {
  res.header("X-Status-Reason: Validation failed");
  res.status(ERROR_BAD_REQUEST);
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
    message: err.message
  });
}


export function handle404(req: express.Request, res: express.Response) {
  res.status(ERROR_NOT_FOUND);
  res.json({
    url: req.originalUrl,
    error: "Not Found"
  });
}
