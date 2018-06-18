"use strict";

import * as mongoose from "mongoose";
import * as error from "../server/error";
import * as passport from "./passport";
import { IToken, Token } from "./schema";


/**
 * @apiDefine TokenResponse
 *
 * @apiSuccessExample {json} Respuesta
 *     HTTP/1.1 200 OK
 *     {
 *       "token": "{Token de autorización}"
 *     }
 */
/**
 * Crea un token de sesión, lo guarda en la base de Tokens, luego inicializa passport
 * con el token, para que se ingrese en el cache y devuelve el token string
 */
export function create(userId: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const sessionToken: IToken = new Token();
        sessionToken.user = mongoose.Types.ObjectId.createFromHexString(userId);
        sessionToken.valid = true;

        sessionToken.save(function (err: any) {
            if (err) reject(err);

            resolve(passport.createSessionToken(userId, sessionToken));
        });
    });
}


/**
 * @api {get} /v1/users/signout Logout
 * @apiName Logout
 * @apiGroup Seguridad
 *
 * @apiDescription Desloguea un usuario en el sistema, invalida el token.
 *
 * @apiSuccessExample {json} Respuesta
 *     HTTP/1.1 200 OK
 *
 * @apiUse AuthHeader
 * @apiUse OtherErrors
 */
export function invalidate(payload: passport.Payload): Promise<void> {
    return new Promise((resolve, reject) => {
        passport.invalidateSessionToken(payload);
        Token.findById(payload.token_id, function (err: any, token: IToken) {
            if (err) return reject(err);

            if (!token) {
                return reject(error.newError(error.ERROR_NOT_FOUND, "Token invalido."));
            }

            token.valid = false;
            token.save(function (err: any) {
                if (err) return reject(err);

                resolve();
            });
        });
    });
}
