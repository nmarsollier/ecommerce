"use strict";

import * as passport from "./passport";

export { create, invalidate } from "./service";

export { Payload } from "./passport";

export const initPassport = passport.init;

