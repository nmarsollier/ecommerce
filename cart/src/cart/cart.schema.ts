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
  articles: [{
    articleId: {
      type: String,
      required: "El articlelId agregado al cart",
      trim: true
    },
    quantity: {
      type: Number
    }
  }],
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

CartSchema.index({ userId: 1, enabled: -1 });
CartSchema.index({ orderId: 1 });

/**
 * Agrega un articulo al carrito
 */
CartSchema.methods.addArticle = function (article: ICartArticle) {
  for (let _i = 0; _i < this.articles.length; _i++) {
    const element: ICartArticle = this.articles[_i];
    if (element.articleId == article.articleId) {
      element.quantity = Number(element.quantity) + Number(article.quantity);
      return;
    }
  }

  this.articles.push(article);
  return;
};


/**
 * Elimina un articulo del carrito
 */
CartSchema.methods.removeArticle = function (article: ICartArticle, index: number) {
  for (let _i = 0; _i < this.articles.length; _i++) {
    const element: ICartArticle = this.articles[_i];

    if (element.articleId == article.articleId) {
      this.articles.splice(index, 1);
      return;
    }
  }
};

/**
 * Decrementa o Elimina un articulo del cartito
 */
CartSchema.methods.decrementArticle = function (article: ICartArticle, index: number) {
  for (let _i = 0; _i < this.articles.length; _i++) {
    const element: ICartArticle = this.articles[_i];
    if (element.articleId == article.articleId) {
      element.quantity--;
      if (element.quantity <= 0) {
        this.articles.splice(index, 1);
      }
      return;
    }
  }
};

/**
 * Trigger antes de guardar
 */
CartSchema.pre("save", next => {
  this.updated = Date.now;

  next();
});

export let Cart = model<ICart>("Cart", CartSchema);
