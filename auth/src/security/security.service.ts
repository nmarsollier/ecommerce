"use strict";

import { User, IUser } from "./user.schema";
import { Token, IToken } from "./token.schema";
import { NextFunction } from "express-serve-static-core";
import * as mongoose from "mongoose";
import * as express from "express";
import * as errorHandler from "../utils/error.handler";
import * as passport from "./passport";
import * as escape from "escape-html";

import * as appConfig from "../utils/environment";
const conf = appConfig.getConfig(process.env);

export interface IUserSession {
  token_id: string;
  user_id: String;
}

export interface IUserSessionRequest extends express.Request {
  user: IUserSession;
}

/**
 * Signup
 */

export function validateSignUp(req: express.Request, res: express.Response, next: NextFunction) {
  req.check("name", "No puede quedar vac&iacute;o.").notEmpty();
  req.check("name", "Hasta 1024 caracteres solamente.").isLength({ max: 1024 });

  req.check("password", "No puede quedar vac&iacute;o.").notEmpty();
  req.check("password", "Mas de 4 caracteres.").isLength({ min: 4 });
  req.check("password", "Hasta 256 caracteres solamente.").isLength({ max: 256 });
  req.check("password", "S&oacute;lo letras y n&uacute;meros.").isAlphanumeric();

  req.check("login", "No puede quedar vac&iacute;o.").notEmpty();
  req.check("login", "Hasta 256 caracteres solamente.").isLength({ max: 64 });
  req.check("login", "S&oacute;lo letras y n&uacute;meros.").isAlphanumeric();

  req.sanitize("name").escape();
  req.sanitize("password").escape();
  req.sanitize("login").escape();

  req.getValidationResult().then(function (result) {
    if (!result.isEmpty()) {
      return errorHandler.handleExpressValidationError(res, result);
    }
    next();
  });
}
export function signup(req: express.Request, res: express.Response) {
  const user = <IUser>new User();
  user.name = req.body.name;
  user.login = req.body.login;
  user.password = req.body.password;
  user.roles = ["user"];

  // Then save the user
  user.save(function (err: any) {
    if (err) return errorHandler.handleError(res, err);

    createToken(res, user);
  });
}

/**
 * Signin
 */
export function validateSignIn(req: express.Request, res: express.Response, next: NextFunction) {
  req.check("password", "No puede quedar vac&iacute;o.").notEmpty();
  req.check("password", "S&oacute;lo letras y n&uacute;meros.").isAlphanumeric();

  req.check("login", "No puede quedar vac&iacute;o.").notEmpty();
  req.check("login", "S&oacute;lo letras y n&uacute;meros.").isAlphanumeric();

  req.sanitize("password").escape();
  req.sanitize("login").escape();

  req.getValidationResult().then(function (result) {
    if (!result.isEmpty()) {
      return errorHandler.handleExpressValidationError(res, result);
    }
    next();
  });
}
export function signin(req: express.Request, res: express.Response, next: NextFunction) {
  User.findOne({
    login: escape(req.body.login),
    enabled: true
  },
    function (err: any, user: IUser) {
      if (err) return errorHandler.handleError(res, err);

      if (!user) {
        return errorHandler.sendError(res, errorHandler.ERROR_NOT_FOUND, "Usuario no encontrado.");
      }

      if (!user.authenticate(req.body.password)) {
        return errorHandler.sendError(res, errorHandler.ERROR_BAD_REQUEST, "Password incorrecto.");
      }

      createToken(res, user);
    }
  );
}

/**
 * Crea un token de sesion, lo guarda en la base de Tokens, luego inicializa passport
 * con el token, para que se ingrese en el cache y se encripte correctamente
 */
function createToken(res: express.Response, user: IUser) {
  const sessionToken = new Token();
  sessionToken.user = user._id;
  sessionToken.valid = true;

  sessionToken.save(function (err: any) {
    if (err) return errorHandler.handleError(res, err);

    res.json({ token: passport.createToken(user, sessionToken) });
  });
}

/**
 * Signout, limpia la sesion, e invalida el token.
 */
export function signout(req: IUserSessionRequest, res: express.Response) {
  Token.findById(req.user.token_id, function (err: any, token: IToken) {
    if (err) return errorHandler.handleError(res, err);

    if (!token) {
      return errorHandler.sendError(res, errorHandler.ERROR_NOT_FOUND, "Token invalido.");
    }

    token.valid = false;
    token.save(function (err: any) {
      if (err) return errorHandler.handleError(res, err);

      passport.invalidateSessionToken(req.user);
      return res.json({
        result: "Logged out"
      });
    });
  });
}

/**
 * Get current user
 */
export function currentUser(req: IUserSessionRequest, res: express.Response, next: NextFunction) {
  User.findOne({
    _id: req.user.user_id,
    enabled: true
  },
    function (err: any, user: IUser) {
      if (err) return errorHandler.handleError(res, err);

      if (!user) {
        return errorHandler.sendError(res, errorHandler.ERROR_NOT_FOUND, "El usuario no se encuentra");
      }
      return res.json({
        id: user.id,
        name: user.name,
        login: user.login,
        roles: user.roles
      });
    });
}


/**
 * Cambiar contraseña
 */
export interface ICambiarPasswordRequest extends IUserSessionRequest {
  usuario: IUser;
}
export function validateCambiarPassword(req: ICambiarPasswordRequest, res: express.Response, next: NextFunction) {
  req.check("currentPassword", "No puede quedar vac&iacute;o.").notEmpty();
  req.check("currentPassword", "Mas de 4 caracteres.").isLength({ min: 4 });
  req.check("currentPassword", "Hasta 256 caracteres solamente.").isLength({ max: 256 });
  req.check("currentPassword", "S&oacute;lo letras y n&uacute;meros.").isAlphanumeric();

  req.check("newPassword", "No puede quedar vac&iacute;o.").notEmpty();
  req.check("newPassword", "Mas de 4 caracteres.").isLength({ min: 4 });
  req.check("newPassword", "Hasta 256 caracteres solamente.").isLength({ max: 256 });
  req.check("newPassword", "S&oacute;lo letras y n&uacute;meros.").isAlphanumeric();

  req.check("verifyPassword", "No puede quedar vac&iacute;o.").notEmpty();
  req.check("verifyPassword", "Mas de 4 caracteres.").isLength({ min: 4 });
  req.check("verifyPassword", "Hasta 256 caracteres solamente.").isLength({ max: 256 });
  req.check("verifyPassword", "S&oacute;lo letras y n&uacute;meros.").isAlphanumeric();

  req.sanitize("currentPassword").escape();
  req.sanitize("newPassword").escape();
  req.sanitize("verifyPassword").escape();

  req.getValidationResult().then(function (result) {
    if (!result.isEmpty()) {
      return errorHandler.handleExpressValidationError(res, result);
    }


    User.findOne(
      {
        _id: req.user.user_id,
        enabled: true
      },
      function (err: any, user: IUser) {
        if (err) return errorHandler.handleError(res, err);

        if (!user) {
          return errorHandler.sendError(res, errorHandler.ERROR_NOT_FOUND, "El usuario no se encuentra.");
        }

        if (req.body.newPassword !== req.body.verifyPassword) {
          return errorHandler.sendError(res, errorHandler.ERROR_BAD_REQUEST, "Las contraseñas no coinciden.");
        }

        if (!user.authenticate(req.body.currentPassword)) {
          return errorHandler.sendError(res, errorHandler.ERROR_BAD_REQUEST, "El password actual es incorrecto.");
        }

        req.usuario = user;

        next();
      });
  });
}
export function changePassword(req: ICambiarPasswordRequest, res: express.Response) {
  req.usuario.password = req.body.newPassword;

  req.usuario.save(function (err: any) {
    if (err) return errorHandler.handleError(res, err);

    return res.send({
      message: "Contraseña cambiada"
    });
  });
}


export function validateAdminRole(req: IUserSessionRequest, res: express.Response, next: NextFunction) {
  User.findOne(
    {
      _id: req.user.user_id,
      enabled: true
    },
    function (err: any, user: IUser) {
      if (err) return errorHandler.handleError(res, err);

      if (!user) {
        return errorHandler.sendError(res, errorHandler.ERROR_NOT_FOUND, "El usuario no se encuentra.");
      }

      if (!(user.roles.indexOf("admin") >= 0)) {
        return errorHandler.sendError(res, errorHandler.ERROR_UNATORIZED, "No autorizado.");
      }

      next();
    });
}