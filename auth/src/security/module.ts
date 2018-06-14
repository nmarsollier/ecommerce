"use strict";

import { Express } from "express";
import * as security from "./security.service";
import * as passport from "passport";

/**
 * Modulo de seguridad, login/logout, cambio de contraseñas, etc
 */
export function init(app: Express) {
  app.route("/user/password").post(passport.authenticate("jwt", { session: false }), security.validateCambiarPassword, security.changePassword);

  app.route("/v1/user").post(security.validateSignUp, security.signUp);
  app.route("/v1/user/signin").post(security.validateSignIn, security.signIn);
  app.route("/v1/user/signout").get(passport.authenticate("jwt", { session: false }), security.signOut);
  app.route("/v1/users/:userID/grant").post(passport.authenticate("jwt", { session: false }), security.fillCurrentUser, security.validateAdmin, security.grantPermission);
  app.route("/v1/users/:userID/revoke").post(passport.authenticate("jwt", { session: false }), security.fillCurrentUser, security.validateAdmin, security.revokePermission);
  app.route("/v1/users/:userID/enable").post(passport.authenticate("jwt", { session: false }), security.fillCurrentUser, security.validateAdmin, security.enableUser);
  app.route("/v1/users/:userID/disable").post(passport.authenticate("jwt", { session: false }), security.fillCurrentUser, security.validateAdmin, security.disableUser);

  app
    .route("/v1/users/current")
    .get(passport.authenticate("jwt", { session: false }), security.fillCurrentUser, security.currentUser);
}
