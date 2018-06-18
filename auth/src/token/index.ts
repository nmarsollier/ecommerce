import * as passport from "./passport";

"use strict";


export { create, invalidate } from "./token";

export { Payload } from "./passport";

export const initPassport = passport.init;

