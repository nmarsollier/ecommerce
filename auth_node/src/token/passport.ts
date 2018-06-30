"use strict";

import * as jwt from "jsonwebtoken";
import * as nodeCache from "node-cache";
import * as passport from "passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import * as appConfig from "../server/environment";
import { IToken, Token } from "./token";
import { ObjectID } from "bson";

export interface Payload {
    token_id: string;
    user_id: string;
}

// Este cache de sesiones en memoria va a evitar que tenga que ir a la base de datos
// para verificar que la sesión sea valida. 1 hora de cache en memoria. Luego se vuelve a leer de la db
const sessionCache = new nodeCache({ stdTTL: 3600, checkperiod: 60 });
const conf = appConfig.getConfig(process.env);

/**
 * @apiDefine AuthHeader
 *
 * @apiExample {String} Header Autorización
 *    Authorization=bearer {token}
 *
 * @apiErrorExample 401 Unauthorized
 *    HTTP/1.1 401 Unauthorized
 */
export function init() {
    const params = {
        secretOrKey: conf.jwtSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    };

    /*
    Este método se utiliza para validar que el usuario se haya logueado.
    passport.authenticate("jwt", { session: false })  termina llamando a este método.
    El resultado de este método es puesto en el request, o sea el payload se pone en el request

    A esta altura el token fue desencriptado correctamente, pero hay que validar el contenido.
    */
    passport.use(new Strategy(params, function (payload: Payload, done) {
        /*
        La estrategia es tener un listado de Token validos en la db y validar contra eso.
        Podemos invalidar un token desde la db, usando Token.valid.

        Pero para no esta leyendo permanentemente en la db, usamos un cacheLocal que nos
        mantiene 1 hora los tokens en memoria, luego de esa hora se vuelven a leer desde la db.
        */
        const cachedSession = sessionCache.get(payload.token_id);
        if (cachedSession) {
            return done(undefined, payload);
        } else {
            Token.findOne({
                _id: payload.token_id,
                valid: true
            },
                function (err: any, token: IToken) {
                    if (err || !token) {
                        return done(undefined, false, { message: "Invalid Token" });
                    }
                    sessionCache.set(token.id, token.user);
                    return done(undefined, payload);
                });
        }
    }));
}

/**
 * Invalida la sesión en passport. Básicamente limpia el cache
 */
export function invalidateSessionToken(token_id: string) {
    sessionCache.del(token_id);
}

/**
 * Crea un token lo pone en el cache, lo encripta y lo devuelve.
 */
export function createSessionToken(sessionToken: IToken): string {
    const payload: Payload = { user_id: sessionToken.user.toHexString(), token_id: sessionToken.id };
    const token = jwt.sign(payload, conf.jwtSecret);
    sessionCache.set(sessionToken.id, sessionToken.user.toHexString());

    return token;
}

export function getTokenFromCache(token_id: string): string {
    return sessionCache.get(token_id);
}