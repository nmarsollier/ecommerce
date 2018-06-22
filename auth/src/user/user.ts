"use strict";

import { pbkdf2Sync } from "crypto";
import { Document, model, Schema } from "mongoose";
import * as env from "../server/environment";

const conf = env.getConfig(process.env);

export interface IUser extends Document {
  name: string;
  login: string;
  password: string;
  permissions: string[];
  updated: Date;
  created: Date;
  enabled: Boolean;
  authenticate: Function;
  setStringPassword: Function;
  grant: Function;
  revoke: Function;
  hasPermission: Function;
}

/**
 * Esquema de un usuario del sistema
 */
const UserSchema = new Schema({
  name: {
    type: String,
    trim: true,
    default: "",
    required: "El nombre de usuario es requerido"
  },
  login: {
    type: String,
    unique: "El login ya existe",
    required: "El login es requerido",
    trim: true
  },
  password: {
    type: String,
    default: "",
    required: "La contraseña es requerida"
  },
  permissions: {
    type: [
      {
        type: String,
      }
    ],
    default: ["user"]
  },
  updated: {
    type: Date,
    default: Date.now()
  },
  created: {
    type: Date,
    default: Date.now()
  },
  enabled: {
    type: Boolean,
    default: true
  }
}, { collection: "users" });

UserSchema.path("password").validate(function (password: string) {
  return password && password.length > 6;
}, "La contraseña debe ser mayor a 6 caracteres");

/**
 * Crea un hash del password
 */
UserSchema.methods.hashPassword = function (password: string) {
  return pbkdf2Sync(password, conf.passwordSalt, 10000, 64, "SHA1").toString("base64");
};

/**
 * Le asigna permisos nuevos a un usuario
 */
UserSchema.methods.grant = function (permissions: string[]) {
  permissions.forEach(p => {
    if ((typeof p === "string") && this.permissions.indexOf(p) < 0) {
      this.permissions.push(p);
    }
  });
};

/**
 * Le asigna permisos nuevos a un usuario
 */
UserSchema.methods.revoke = function (permissions: string[]) {
  permissions.forEach(p => {
    if (typeof p === "string") {
      const idx = this.permissions.indexOf(p);
      if (idx) {
        this.permissions.splice(idx, 1);
      }
    }
  });
};

UserSchema.methods.hasPermission = function (permission: string): boolean {
  return this.permissions.indexOf(permission) >= 0;
};

/**
 * Autentifica un usuario
 */
UserSchema.methods.authenticate = function (password: string) {
  return this.password && this.password === this.hashPassword(password);
};

/**
 * Permite cambiar la contraseña de usuario
 */
UserSchema.methods.setStringPassword = function (password: string) {
  this.password = this.hashPassword(password);

  this.updated = Date.now();
};

export let User = model<IUser>("User", UserSchema);
