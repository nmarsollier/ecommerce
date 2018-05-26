"use strict";

import { NextFunction } from "express-serve-static-core";
import { RestClient } from "typed-rest-client/RestClient";

import * as nodeCache from "node-cache";
import * as error from "../utils/error";
import * as express from "express";
import * as env from "../utils/environment";
import * as chalk from "chalk";

// Este cache de sesiones en memoria va a evitar que tenga que ir a la base de datos
// para verificar que la sesion sea valida. 1 hora de cache en memoria. Luego se vuelve a leer de la db
const sessionCache = new nodeCache({ stdTTL: 3600, checkperiod: 60 });
const conf = env.getConfig(process.env);

export interface IUser {
  id: string;
  name: string;
  login: string;
  roles: string[];
}

export interface ISession {
  token: string;
  user: IUser;
}

export interface IUserSessionRequest extends express.Request {
  user: ISession;
}

/**
 * @apiDefine AuthHeader
 *
 * @apiParamExample {String} Authorization Header
 *    Authorization=bearer {token}
 */

/**
 * @apiDefine Unautorized
 *
 * @apiSuccessExample 401 Unautorized
 *     HTTP/1.1 401 Unautorized
 */

export function validateSesssionToken(req: IUserSessionRequest, res: express.Response, next: NextFunction) {
  const auth = req.header("Authorization");
  if (!auth) {
    return error.sendError(res, error.ERROR_UNATORIZED, "Unautorized");
  }

  /*
    Mantenemos un listado en memoria, si el token no esta en memoria, se busca en el
    servidor de seguridad.
  */
  const cachedSession = sessionCache.get(auth);
  if (cachedSession) {
    req.user = {
      token: auth,
      user: cachedSession as IUser
    };
    return next();
  } else {
    const restc: RestClient = new RestClient("CurrentUser", conf.securityServer);

    restc.get<any>("/auth/currentUser",
      { additionalHeaders: { "Authorization": auth } }).then(
        (data) => {
          sessionCache.set(auth, data);
          req.user = {
            token: auth,
            user: cachedSession as IUser
          };
          return next();
        }
      ).catch(
        (error) => {
          return error.sendError(res, error.ERROR_UNATORIZED, "Unautorized");
        }
      );
  }
}

export function invalidateSessionToken(token: string) {
  if (sessionCache.get(token)) {
    sessionCache.del(token);
    console.log(chalk.default.green("RabbitMQ session invalidada " + token));
  }
}