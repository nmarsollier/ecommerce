"use strict";

import { Document, model, Schema } from "mongoose";
import * as env from "../server/environment";
import { sendArticleValidation } from "../rabbit/cartService";

const conf = env.getConfig(process.env);

export interface ICartArticle {
  articleId: string;
  quantity: number;
  validated?: Boolean;
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
 * Esquema del cart
 */
const CartSchema = new Schema({
  userId: {
    type: String,
    trim: true,
    default: "",
    required: "El userId asociado al cart"
  },
  orderId: {
    type: String,
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
    },
    validated: {
      type: Boolean,
      default: false
    }
  }],
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
}, { collection: "cart" });

CartSchema.index({ userId: 1, enabled: -1 });
CartSchema.index({ userId: 1, orderId: 1 });

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
  sendArticleValidation(this._id, article.articleId).then();
  return;
};


/**
 * Elimina un articulo del carrito
 */
CartSchema.methods.removeArticle = function (articleId: string) {
  for (let _i = 0; _i < this.articles.length; _i++) {
    const element: ICartArticle = this.articles[_i];

    if (element.articleId === articleId) {
      this.articles.splice(_i, 1);
      return;
    }
  }
};

/**
 * Decremento o Elimina un articulo del carrito
 */
CartSchema.methods.decrementArticle = function (article: ICartArticle) {
  for (let _i = 0; _i < this.articles.length; _i++) {
    const element: ICartArticle = this.articles[_i];
    if (element.articleId == article.articleId) {
      element.quantity--;
      if (element.quantity <= 0) {
        this.articles.splice(_i, 1);
      }
      return;
    }
  }
};

/**
 * Trigger antes de guardar
 */
CartSchema.pre("save", function (this: ICart, next) {
  this.updated = new Date();

  next();
});

export let Cart = model<ICart>("Cart", CartSchema);
