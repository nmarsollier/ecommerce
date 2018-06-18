"use strict";

import * as passport from "./passport";

export { create, invalidate } from "./token";

export { Payload } from "./passport";

export const initPassport = passport.init;

