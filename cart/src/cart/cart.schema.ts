"use strict";

import { Document, Schema, Model, model } from "mongoose";
import { pbkdf2Sync } from "crypto";

import * as env from "../utils/environment";
const conf = env.getConfig(process.env);

export interface ICartArticle {
  articleId: string;
  quantity: number;
}

export interface ICart extends Document {
  userId: string;
  orderId: string;
  articles: ICartArticle[];
  updated: Date;
  created: Date;
  enabled: Boolean;
  addArticle: Function;
  removeArticle: Function;
  incrementArticle: Function;
  decrementArticle: Function;
}

/**
 * Esquea del cart
 */
export let CartSchema = new Schema({
  userId: {
    type: String,
    trim: true,
    default: "",
    required: "El userId asociado al cart"
  },
  orderId: {
    type: String,
    unique: "El login ya existe",
    trim: true
  },
  articles: {
    type: [
      {
        type: {
          articleId: {
            type: String
          },
          quantity: {
            type: Number
          }
        }
      }
    ]
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
}, { collection: "cart" });


/**
 * Agrega un articulo a la coleccion
 */
CartSchema.methods.addArticle = function (article: ICartArticle) {
  this.articles.array.forEach(function (element: ICartArticle) {
    if (element.articleId == article.articleId) {
      element.quantity += article.quantity;
      return;
    }
  });

  this.articles.push(article);
  return;
};


/**
 * Elimina un articulo de la coleccion
 */
CartSchema.methods.removeArticle = function (article: ICartArticle, index: number) {
  this.articles.array.forEach(function (element: ICartArticle) {
    if (element.articleId == article.articleId) {
      this.articles.splice(index, 1);
      return;
    }
  });
};

/**
 * Elimina un articulo de la coleccion
 */
CartSchema.methods.incrementArticle = function (article: ICartArticle, index: number) {
  this.articles.array.forEach(function (element: ICartArticle) {
    if (element.articleId == article.articleId) {
      element.quantity += article.quantity;
      return;
    }
  });
  this.articles.push(article);
  return;
};

/**
 * Elimina un articulo de la coleccion
 */
CartSchema.methods.decrementArticle = function (article: ICartArticle, index: number) {
  this.articles.array.forEach(function (element: ICartArticle) {
    if (element.articleId == article.articleId) {
      element.quantity--;
      if (element.quantity == 0) {
        this.articles.splice(index, 1);
      }
      return;
    }
  });
};

/**
 * Trigger antes de guardar, si el password se mofico hay que encriptarlo
 */
CartSchema.pre("save", next => {
  this.updated = Date.now;

  next();
});

export let Cart = model<ICart>("User", CartSchema);
