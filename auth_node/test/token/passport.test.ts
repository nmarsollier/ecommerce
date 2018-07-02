import * as passport from "../../src/token/passport";

import { IToken, Token } from "../../src/token/token";
import { ObjectID } from "bson";

describe("Test /src/token/passport", () => {
    const token: IToken = new Token();
    token.valid = true;
    token.user = new ObjectID("5b21e32e1588d73f626f5751");

    it("Agregar token al cache", () => {
        const tokenString = passport.createSessionToken(token);
        expect(tokenString.length).toBeGreaterThan(20);
    });

    it("Verificar token en el cache", () => {
        expect(passport.getTokenFromCache(token.id)).toEqual(token.user.toHexString());
    });

    it("Eliminar token del cache", () => {
        passport.invalidateSessionToken(token.id);
        expect(passport.getTokenFromCache(token.id)).toBeUndefined();
    });
});