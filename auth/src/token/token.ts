"use strict";

import * as mongoose from "mongoose";
import * as error from "../server/error";
import * as passport from "./passport";
import { IToken, Token } from "./schema";

/**
 * Crea un token de sesión, lo guarda en la base de Tokens, luego inicializa passport
 * con el token, para que se ingrese en el cache y devuelve el token string
 */
export function create(userId: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const token: IToken = new Token();
        token.user = mongoose.Types.ObjectId.createFromHexString(userId);
        token.valid = true;

        token.save(function (err: any) {
            if (err) reject(err);

            resolve(passport.createSessionToken(userId, token));
        });
    });
}

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
