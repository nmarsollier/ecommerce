"use strict";

import * as nodeCache from "node-cache";
import { RestClient } from "typed-rest-client/RestClient";
import * as env from "../server/environment";
import * as error from "../server/error";

// Este cache de sesiones en memoria va a evitar que tenga que ir a la base de datos
// para verificar que la sesión sea valida. 1 hora de cache en memoria. Luego se vuelve a leer de la db
const sessionCache = new nodeCache({ stdTTL: 3600, checkperiod: 60 });
const conf = env.getConfig(process.env);

export interface IUser {
  id: string;
  name: string;
  login: string;
  permissions: string[];
}

export interface ISession {
  token: string;
  user: IUser;
}

export async function validate(auth: string): Promise<ISession> {
  return new Promise<ISession>((resolve, reject) => {
    /*
      Mantenemos un listado en memoria, si el token no esta en memoria, se busca en el
      servidor de seguridad.
    */
    const cachedSession = sessionCache.get(auth);
    if (cachedSession) {
      return resolve({
        token: auth,
        user: cachedSession as IUser
      });
    }

    const restClient: RestClient = new RestClient("CurrentUser", conf.securityServer);

    restClient.get<any>("/v1/users/current", {
      additionalHeaders: { "Authorization": auth }
    }).then(data => {
      sessionCache.set(auth, data.result);
      resolve({
        token: auth,
        user: data.result as IUser
      });
    }).catch(exception => {
      reject(error.newError(error.ERROR_UNAUTHORIZED, "Unauthorized"));
    });
  });
}

export function invalidate(token: string) {
  if (sessionCache.get(token)) {
    sessionCache.del(token);
    console.log("RabbitMQ session invalidada " + token);
  }
}