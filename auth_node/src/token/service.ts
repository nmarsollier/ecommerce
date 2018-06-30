"use strict";

import * as mongoose from "mongoose";
import * as error from "../server/error";
import * as passport from "./passport";
import { IToken, Token } from "./token";

/**
 * Crea un token de sesión, lo guarda en la base de Tokens, luego inicializa passport
 * con el token, para que se ingrese en el cache y devuelve el token string
 */
export async function create(userId: string): Promise<string> {
    try {
        const token: IToken = new Token();
        token.user = mongoose.Types.ObjectId.createFromHexString(userId);
        token.valid = true;

        const t = await token.save();

        return Promise.resolve(passport.createSessionToken(token));
    } catch (err) {
        return Promise.reject(err);
    }
}

export async function invalidate(payload: passport.Payload): Promise<void> {
    try {
        passport.invalidateSessionToken(payload.token_id);
        let token = await Token.findById(payload.token_id).exec();
        if (!token) {
            throw error.newError(error.ERROR_NOT_FOUND, "Token invalido.");
        }
        token.valid = false;
        token = await token.save();
        return Promise.resolve();
    } catch (err) {
        return Promise.reject(err);
    }
}
