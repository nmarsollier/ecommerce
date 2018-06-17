"use strict";

import * as env from "../utils/environment";
import * as error from "../utils/error";
import { IUser, User } from "./schema";

const conf = env.getConfig(process.env);

export interface SignUpRequest {
    name?: string;
    password?: string;
    login?: string;
}

export function register(body: SignUpRequest): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        validateRegister(body)
            .then(body => {
                const user = <IUser>new User();
                user.name = body.name;
                user.login = body.login;
                user.permissions = ["user"];
                user.setStringPassword(body.password);

                // Then save the user
                user.save(function (err: any) {
                    if (err) reject(err);
                    resolve(user._id.toHexString());
                });
            })
            .catch(error => reject(error));
    });
}
function validateRegister(body: SignUpRequest): Promise<SignUpRequest> {
    const result: error.ValidationErrorMessage = {
        messages: []
    };

    if (!body.name || body.name.length <= 0) {
        result.messages.push({ path: "name", message: "No puede quedar vacío." });
    } else if (body.name.length > 1024) {
        result.messages.push({ path: "name", message: "Hasta 1024 caracteres solamente." });
    }

    if (!body.password) {
        result.messages.push({ path: "password", message: "No puede quedar vacío." });
    } else if (body.password.length <= 4) {
        result.messages.push({ path: "password", message: "Mas de 4 caracteres." });
    } else if (body.password.length > 256) {
        result.messages.push({ path: "password", message: "Hasta 256 caracteres solamente." });
    }

    if (!body.login || body.login.length <= 0) {
        result.messages.push({ path: "login", message: "No puede quedar vacío." });
    } else if (body.login.length > 256) {
        result.messages.push({ path: "login", message: "Hasta 256 caracteres solamente." });
    }

    if (result.messages.length > 0) {
        return Promise.reject(result);
    }
    return Promise.resolve(body);
}


export interface SignInRequest {
    password?: string;
    login?: string;
}
export function login(body: SignInRequest): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        validateLogin(body)
            .then(body => {
                User.findOne({
                    login: body.login,
                    enabled: true
                },
                    function (err: any, user: IUser) {
                        if (err) return reject(err);

                        if (!user) {
                            return reject(error.newArgumentError("login", "Usuario no encontrado."));
                        }

                        if (!user.authenticate(body.password)) {
                            return reject(error.newArgumentError("password", "Password incorrecto."));
                        }

                        resolve(user._id.toHexString());
                    }
                );
            })
            .catch(error => reject(error));
    });
}
function validateLogin(body: SignInRequest): Promise<SignInRequest> {
    const result: error.ValidationErrorMessage = {
        messages: []
    };

    if (!body.password) {
        result.messages.push({ path: "password", message: "No puede quedar vacío." });
    }

    if (!body.login || body.login.length <= 0) {
        result.messages.push({ path: "login", message: "No puede quedar vacío." });
    }

    if (result.messages.length > 0) {
        return Promise.reject(result);
    }
    return Promise.resolve(body);
}

export function findById(userId: string): Promise<IUser> {
    return new Promise<IUser>((resolve, reject) => {
        User.findOne({
            _id: userId
        },
            function (err: any, user: IUser) {
                if (err) return reject(err);

                if (!user) {
                    return reject(error.newError(error.ERROR_NOT_FOUND, "El usuario no se encuentra"));
                }

                resolve(user);
            });
    });
}

export function changePassword(userId: string, body: ChangePasswordRequest): Promise<void> {
    return new Promise((resolve, reject) => {
        validateChangePassword(userId, body).then(user => {
            user.setStringPassword(body.newPassword);

            user.save(function (err: any) {
                if (err) return reject(err);

                return resolve();
            });
        }).catch(error => reject(error));
    });
}

/**
 * Cambiar contraseña
 */
interface ChangePasswordRequest {
    currentPassword?: string;
    newPassword?: string;
}
function validateChangePassword(userId: string, body: ChangePasswordRequest): Promise<IUser> {
    return new Promise((resolve, reject) => {
        const result: error.ValidationErrorMessage = {
            messages: []
        };

        if (!body.currentPassword) {
            result.messages.push({ path: "currentPassword", message: "No puede quedar vacío." });
        } else if (body.currentPassword.length <= 4) {
            result.messages.push({ path: "currentPassword", message: "Mas de 4 caracteres." });
        } else if (body.currentPassword.length > 256) {
            result.messages.push({ path: "currentPassword", message: "Hasta 256 caracteres solamente." });
        }

        if (!body.newPassword) {
            result.messages.push({ path: "newPassword", message: "No puede quedar vacío." });
        } else if (body.newPassword.length <= 4) {
            result.messages.push({ path: "newPassword", message: "Mas de 4 caracteres." });
        } else if (body.newPassword.length > 256) {
            result.messages.push({ path: "newPassword", message: "Hasta 256 caracteres solamente." });
        }

        if (result.messages.length > 0) {
            return reject(result);
        }

        User.findOne(
            {
                _id: userId,
                enabled: true
            },
            function (err: any, user: IUser) {
                if (err) return reject(err);

                if (!user) {
                    return reject(error.newError(error.ERROR_NOT_FOUND, "El usuario no se encuentra."));
                }

                if (!user.authenticate(body.currentPassword)) {
                    return reject(error.newArgumentError("currentPassword", "El password actual es incorrecto."));
                }

                return resolve(user);
            });
    });
}

export function hasPermission(userId: string, permission: string): Promise<void> {
    return new Promise((resolve, reject) => {
        User.findOne(
            {
                _id: userId,
                enabled: true
            },
            function (err: any, user: IUser) {
                if (err) return reject(err);

                if (user.permissions.indexOf(permission) < 0) {
                    return reject(error.newError(error.ERROR_UNAUTHORIZED, "Accesos insuficientes"));
                }
                resolve();
            });
    });
}

export function grant(userId: string, permissions: string[]): Promise<void> {
    if (!permissions || !(permissions instanceof Array))
        return Promise.reject(error.newArgumentError("permissions", "Invalid value"));

    return new Promise((resolve, reject) => {
        User.findOne({
            _id: userId
        },
            function (err: any, user: IUser) {
                if (err) {
                    return reject(err);
                }
                if (!user) {
                    return reject(error.newError(error.ERROR_NOT_FOUND, "El usuario no se encuentra"));
                }

                user.grant(permissions);

                user.save(function (err: any) {
                    if (err) return reject(err);

                    return resolve();
                });
            });
    });
}

export function revoke(userId: string, permissions: string[]): Promise<void> {
    if (!permissions || !(permissions instanceof Array))
        return Promise.reject(error.newArgumentError("permissions", "Invalid value"));

    return new Promise((resolve, reject) => {
        User.findOne({
            _id: userId
        },
            function (err: any, user: IUser) {
                if (err) {
                    return reject(err);
                }
                if (!user) {
                    return reject(error.newError(error.ERROR_NOT_FOUND, "El usuario no se encuentra"));
                }

                user.revoke(permissions);

                user.save(function (err: any) {
                    if (err) return reject(err);

                    return resolve();
                });
            });
    });
}

export function enable(userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
        User.findOne({
            _id: userId
        },
            function (err: any, user: IUser) {
                if (err) {
                    return reject(err);
                }
                if (!user) {
                    return reject(error.newError(error.ERROR_NOT_FOUND, "El usuario no se encuentra"));
                }

                user.enabled = true;

                user.save(function (err: any) {
                    if (err) return reject(err);

                    return resolve();
                });
            });
    });
}

export function disable(userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
        User.findOne({
            _id: userId
        },
            function (err: any, user: IUser) {
                if (err) {
                    return reject(err);
                }
                if (!user) {
                    return reject(error.newError(error.ERROR_NOT_FOUND, "El usuario no se encuentra"));
                }

                user.enabled = false;

                user.save(function (err: any) {
                    if (err) return reject(err);

                    return resolve();
                });
            });
    });
}