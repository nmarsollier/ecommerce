"use strict";

import { User, IUser } from "./user.schema";
import { Token, IToken } from "./token.schema";
import { NextFunction } from "express-serve-static-core";

import * as express from "express";
import * as error from "../utils/error";
import * as passport from "./passport.service";
import * as escape from "escape-html";
import * as rabbit from "../rabbit/rabbit.service";

import * as env from "../utils/environment";
const conf = env.getConfig(process.env);

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
  req.check("name", "No puede quedar vacío.").notEmpty();
  req.check("name", "Hasta 1024 caracteres solamente.").isLength({ max: 1024 });

  req.check("password", "No puede quedar vacío.").notEmpty();
  req.check("password", "Mas de 4 caracteres.").isLength({ min: 4 });
  req.check("password", "Hasta 256 caracteres solamente.").isLength({ max: 256 });
  req.check("password", "Sólo letras y números.").isAlphanumeric();

  req.check("login", "No puede quedar vacío.").notEmpty();
  req.check("login", "Hasta 256 caracteres solamente.").isLength({ max: 64 });
  req.check("login", "Sólo letras y números.").isAlphanumeric();

  req.sanitize("name").escape();
  req.sanitize("password").escape();
  req.sanitize("login").escape();

  req.getValidationResult().then(function (result) {
    if (!result.isEmpty()) {
      return error.handleExpressValidationError(res, result);
    }
    next();
  });
}

/**
 * @api {post} /auth/signup Registrar Usuario
 * @apiName signup
 * @apiGroup Seguridad
 *
 * @apiDescription Registra un nuevo usuario en el sistema.
 *
 * @apiParamExample {json} Body
 *    {
 *      "name": "{Nombre de Usuario}",
 *      "login": "{Login de usuario}",
 *      "password": "{Contraseña}"
 *    }
 *
 * @apiUse TokenResponse
 *
 * @apiUse ParamValidationErrors
 * @apiUse OtherErrors
 */
export function signUp(req: express.Request, res: express.Response) {
  const user = <IUser>new User();
  user.name = req.body.name;
  user.login = req.body.login;
  user.password = req.body.password;
  user.roles = ["user"];

  // Then save the user
  user.save(function (err: any) {
    if (err) return error.handleError(res, err);

    createToken(res, user);
  });
}

export function validateSignIn(req: express.Request, res: express.Response, next: NextFunction) {
  req.check("password", "No puede quedar vacío.").notEmpty();
  req.check("password", "Sólo letras y números.").isAlphanumeric();

  req.check("login", "No puede quedar vacío.").notEmpty();
  req.check("login", "Sólo letras y números.").isAlphanumeric();

  req.sanitize("password").escape();
  req.sanitize("login").escape();

  req.getValidationResult().then(function (result) {
    if (!result.isEmpty()) {
      return error.handleExpressValidationError(res, result);
    }
    next();
  });
}

/**
 * @api {post} /auth/signin Login
 * @apiName Log in
 * @apiGroup Seguridad
 *
 * @apiDescription Loguea un usuario en el sistema.
 *
 * @apiParamExample {json} Body
 *    {
 *      "login": "{Login de usuario}",
 *      "password": "{Contraseña}"
 *    }
 *
 * @apiUse TokenResponse
 *
 * @apiUse ParamValidationErrors
 * @apiUse OtherErrors
 */
export function signIn(req: express.Request, res: express.Response, next: NextFunction) {
  User.findOne({
    login: escape(req.body.login),
    enabled: true
  },
    function (err: any, user: IUser) {
      if (err) return error.handleError(res, err);

      if (!user) {
        return error.sendArgumentError(res, "login", "Usuario no encontrado.");
      }

      if (!user.authenticate(req.body.password)) {
        return error.sendArgumentError(res, "password", "Password incorrecto.");
      }

      createToken(res, user);
    }
  );
}

/**
 * @apiDefine TokenResponse
 *
 * @apiSuccessExample {json} Respuesta
 *     HTTP/1.1 200 OK
 *     {
 *       "token": "{Token de autorización}"
 *     }
 */
/**
 * Crea un token de sesión, lo guarda en la base de Tokens, luego inicializa passport
 * con el token, para que se ingrese en el cache y se encripte correctamente
 */
function createToken(res: express.Response, user: IUser) {
  const sessionToken = new Token();
  sessionToken.user = user._id;
  sessionToken.valid = true;

  sessionToken.save(function (err: any) {
    if (err) return error.handleError(res, err);

    res.json({ token: passport.createToken(user, sessionToken) });
  });
}

/**
 * @api {get} /auth/signout Logout
 * @apiName SignOut
 * @apiGroup Seguridad
 *
 * @apiDescription Desloguea un usuario en el sistema, invalida el token.
 *
 * @apiSuccessExample {json} Respuesta
 *     HTTP/1.1 200 OK
 *
 * @apiUse AuthHeader
 * @apiUse OtherErrors
 */
export function signOut(req: IUserSessionRequest, res: express.Response) {
  Token.findById(req.user.token_id, function (err: any, token: IToken) {
    if (err) return error.handleError(res, err);

    if (!token) {
      return error.sendError(res, error.ERROR_NOT_FOUND, "Token invalido.");
    }

    token.valid = false;
    token.save(function (err: any) {
      if (err) return error.handleError(res, err);

      passport.invalidateSessionToken(req.user);

      rabbit.sendLogout(req.header("Authorization"))
        .catch(
          (err) => {
            console.error("signout " + err);
          }
        );

      return res.send();
    });
  });
}

/**
 * @api {get} /auth/currentUser Usuario Actual
 * @apiName CurrentUser
 * @apiGroup Seguridad
 *
 * @apiDescription Obtiene información del usuario actual.
 *
 * @apiSuccessExample {json} Respuesta
 *     HTTP/1.1 200 OK
 *     {
 *        "id": "{Id usuario}",
 *        "name": "{Nombre del usuario}",
 *        "login": "{Login de usuario}",
 *        "roles": [
 *            "{Rol}"
 *        ]
 *     }
 *
 * @apiUse AuthHeader
 * @apiUse OtherErrors
 */
export function currentUser(req: IUserSessionRequest, res: express.Response, next: NextFunction) {
  User.findOne({
    _id: req.user.user_id,
    enabled: true
  },
    function (err: any, user: IUser) {
      if (err) return error.handleError(res, err);

      if (!user) {
        return error.sendError(res, error.ERROR_NOT_FOUND, "El usuario no se encuentra");
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
  req.check("currentPassword", "No puede quedar vacío.").notEmpty();
  req.check("currentPassword", "Mas de 4 caracteres.").isLength({ min: 4 });
  req.check("currentPassword", "Hasta 256 caracteres solamente.").isLength({ max: 256 });
  req.check("currentPassword", "Sólo letras y números.").isAlphanumeric();

  req.check("newPassword", "No puede quedar vacío.").notEmpty();
  req.check("newPassword", "Mas de 4 caracteres.").isLength({ min: 4 });
  req.check("newPassword", "Hasta 256 caracteres solamente.").isLength({ max: 256 });
  req.check("newPassword", "Sólo letras y números.").isAlphanumeric();

  req.check("verifyPassword", "No puede quedar vacío.").notEmpty();
  req.check("verifyPassword", "Mas de 4 caracteres.").isLength({ min: 4 });
  req.check("verifyPassword", "Hasta 256 caracteres solamente.").isLength({ max: 256 });
  req.check("verifyPassword", "Sólo letras y números.").isAlphanumeric();

  req.sanitize("currentPassword").escape();
  req.sanitize("newPassword").escape();
  req.sanitize("verifyPassword").escape();

  req.getValidationResult().then(function (result) {
    if (!result.isEmpty()) {
      return error.handleExpressValidationError(res, result);
    }


    User.findOne(
      {
        _id: req.user.user_id,
        enabled: true
      },
      function (err: any, user: IUser) {
        if (err) return error.handleError(res, err);

        if (!user) {
          return error.sendError(res, error.ERROR_NOT_FOUND, "El usuario no se encuentra.");
        }

        if (req.body.newPassword !== req.body.verifyPassword) {
          return error.sendError(res, error.ERROR_BAD_REQUEST, "Las contraseñas no coinciden.");
        }

        if (!user.authenticate(req.body.currentPassword)) {
          return error.sendError(res, error.ERROR_BAD_REQUEST, "El password actual es incorrecto.");
        }

        req.usuario = user;

        next();
      });
  });
}

/**
 * @api {post} /auth/password Cambiar Password
 * @apiName ChangePassword
 * @apiGroup Seguridad
 *
 * @apiDescription Cambia la contraseña del usuario actual.
 *
 * @apiParamExample {json} Body
 *    {
 *      "currentPassword" : "{Contraseña actual}",
 *      "verifyPassword" : "{Contraseña actual}"
 *      "newPassword" : "{Nueva Contraseña}",
 *    }
 *
 * @apiSuccessExample {json} Respuesta
 *     HTTP/1.1 200 OK
 *
 * @apiUse AuthHeader
 * @apiUse ParamValidationErrors
 * @apiUse OtherErrors
 */
export function changePassword(req: ICambiarPasswordRequest, res: express.Response) {
  req.usuario.password = req.body.newPassword;

  req.usuario.save(function (err: any) {
    if (err) return error.handleError(res, err);

    return res.send();
  });
}

export function validateAdminRole(req: IUserSessionRequest, res: express.Response, next: NextFunction) {
  User.findOne(
    {
      _id: req.user.user_id,
      enabled: true
    },
    function (err: any, user: IUser) {
      if (err) return error.handleError(res, err);

      if (!user) {
        return error.sendError(res, error.ERROR_NOT_FOUND, "El usuario no se encuentra.");
      }

      if (!(user.roles.indexOf("admin") >= 0)) {
        return error.sendError(res, error.ERROR_UNAUTHORIZED, "No autorizado.");
      }

      next();
    });
}