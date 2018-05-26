"use strict";

import { Document, Schema, Model, model } from "mongoose";
import { pbkdf2Sync } from "crypto";

import * as env from "../utils/environment";
const conf = env.getConfig(process.env);

export interface IUser extends Document {
  name: string;
  login: string;
  password: string;
  roles: string[];
  updated: Date;
  created: Date;
  enabled: Boolean;
  authenticate: Function;
}

/**
 * Validacion para tamaño de contraseña
 */
const validateLocalStrategyPassword = function (password: string) {
  return password && password.length > 6;
};

/**
 * Esquea de un usuario del sistema
 */
export let UserSchema = new Schema({
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
  roles: {
    type: [
      {
        type: String,
        enum: ["user", "admin"]
      }
    ],
    default: ["user"]
  },
  updated: {
    type: Date,
    default: Date.now
  },
  created: {
    type: Date,
    default: Date.now
  },
  enabled: {
    type: Boolean,
    default: true
  }
}, { collection: "users" });

UserSchema.path("password").validate(function (value: string) {
  return validateLocalStrategyPassword(value);
}, "La contraseña debe ser mayor a 6 caracteres");

/**
 * Crea un hash del passwrod
 */
UserSchema.methods.hashPassword = function (password: string) {
  return pbkdf2Sync(password, conf.passwordSalt, 10000, 64, "SHA1").toString("base64");
};

/**
 * Trigger antes de guardar, si el password se mofico hay que encriptarlo
 */
const fixPassword = function (next: Function) {
  if (this.isModified("password") && this.password && this.password.length > 6) {
    this.password = this.hashPassword(this.password);
  }

  this.updated = Date.now;

  next();
};
UserSchema.pre("save", fixPassword);

/**
 * Authentica un usuario
 */
UserSchema.methods.authenticate = function (password: string) {
  return this.password && this.password === this.hashPassword(password);
};

export let User = model<IUser>("User", UserSchema);
