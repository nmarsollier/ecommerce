import * as service from "../../src/token/service";
import * as passport from "../../src/token/passport";

import mockingoose from "mockingoose";
import { ObjectID } from "bson";
import { IToken, Token } from "../../src/token/token";
import { Payload } from "../../src/token/passport";

describe("Test /src/token/service", () => {
    const token: IToken = new Token();
    token.id = "5b21e32e1588d73f626f5751";
    token._id = new ObjectID("5b21e32e1588d73f626f5751");
    token.valid = true;
    token.user = new ObjectID("5b21e32e1588d73f626f5751");

    const payload: Payload = {
        token_id: token.id,
        user_id: token.user.toHexString()
    };

    mockingoose.Token.toReturn(token, "save");
    mockingoose.Token.toReturn(token, "findOne");

    it("Agregar token al cache", () => {
        service.create(token.user.toHexString()).then(token => {
            expect(token.length).toBeGreaterThan(20);
        }).catch(err => expect(err).toBeUndefined());
    });

    it("Invalidar token", () => {
        service.invalidate(payload).then(_ => {
            expect(passport.getTokenFromCache(token.id)).toBeUndefined();
        }).catch(err => expect(err).toBeUndefined());
    });
});