"use strict";

import { Express } from "express";
import * as cart from "./cart.rest.service";
import * as security from "../utils/security";

/**
 * Modulo de seguridad, login/logout, cambio de contraseñas, etc
 */
export function init(app: Express) {

  app.route("/cart/article").post(security.validateSesssionToken, cart.findCurrentCart, cart.validateAddArticle, cart.addArticle);

  app.route("/cart").get(security.validateSesssionToken, cart.findCurrentCart, cart.getCurrentCart);

  app.route("/cart/article/:articleId").delete(security.validateSesssionToken, cart.findCurrentCart, cart.validateDelete, cart.deleteArticle);

  app.route("/cart/article/:articleId/increment").post(security.validateSesssionToken, cart.findCurrentCart, cart.validateAddArticle, cart.incrementArticle);

  app.route("/cart/article/:articleId/decrement").post(security.validateSesssionToken, cart.findCurrentCart, cart.validateAddArticle, cart.decrementArticle);

  app.route("/cart/checkout").post(security.validateSesssionToken, cart.findCurrentCart, cart.validateOrder, cart.postOrder);

}
