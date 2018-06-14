"use strict";

import { Express } from "express";
import * as security from "./security.service";
import * as passport from "passport";

/**
 * Modulo de seguridad, login/logout, cambio de contraseñas, etc
 */
export function init(app: Express) {
  app.route("/user/password").post(passport.authenticate("jwt", { session: false }), security.validateCambiarPassword, security.changePassword);

  app.route("/user").post(security.validateSignUp, security.signUp);
  app.route("/user/signin").post(security.validateSignIn, security.signIn);
  app.route("/user/signout").get(passport.authenticate("jwt", { session: false }), security.signOut);
  app.route("/users/:userID/grant").post(passport.authenticate("jwt", { session: false }), security.fillCurrentUser, security.validateAdmin, security.grantPermission);
  app.route("/users/:userID/revoke").post(passport.authenticate("jwt", { session: false }), security.fillCurrentUser, security.validateAdmin, security.revokePermission);
  app.route("/users/:userID/enable").post(passport.authenticate("jwt", { session: false }), security.fillCurrentUser, security.validateAdmin, security.enableUser);
  app.route("/users/:userID/disable").post(passport.authenticate("jwt", { session: false }), security.fillCurrentUser, security.validateAdmin, security.disableUser);

  app
    .route("/users/current")
    .get(passport.authenticate("jwt", { session: false }), security.fillCurrentUser, security.currentUser);
}
