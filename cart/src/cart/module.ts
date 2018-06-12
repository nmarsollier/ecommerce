"use strict";

import { Express } from "express";
import * as security from "../utils/security";
import * as cart from "./cart.rest.service";

/**
 * Modulo de seguridad, login/logout, cambio de contraseñas, etc
 */
export function init(app: Express) {

  app.route("/cart/article").post(security.validateSessionToken, cart.findCurrentCart, cart.validateAddArticle, cart.addArticle);

  app.route("/cart").get(security.validateSessionToken, cart.findCurrentCart, cart.getCurrentCart);

  app.route("/cart/article/:articleId").delete(security.validateSessionToken, cart.findCurrentCart, cart.validateDelete, cart.deleteArticle);

  app.route("/cart/article/:articleId/increment").post(security.validateSessionToken, cart.findCurrentCart, cart.validateAddArticle, cart.incrementArticle);

  app.route("/cart/article/:articleId/decrement").post(security.validateSessionToken, cart.findCurrentCart, cart.validateAddArticle, cart.decrementArticle);

  app.route("/cart/validate").get(security.validateSessionToken, cart.findCurrentCart, cart.validateOrder, cart.validateToCheckout);

  app.route("/cart/checkout").post(security.validateSessionToken, cart.findCurrentCart, cart.validateOrder, cart.postOrder);

}
