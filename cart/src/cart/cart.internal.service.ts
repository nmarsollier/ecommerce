"use strict";
/**
 * Servicios internos de Cart, normalmente son llamados por procesos Rabbit o background
 */

import { ICart, Cart, ICartArticle } from "./cart.schema";

export interface IArticleExistMessage {
    type: string;
    cartId: string;
    articleId: string;
    valid: boolean;
}

/**
 * Procesa una validacion realizada a travez de rabbit.
 * Si un articulo no es valido se elimina del cart.
 */
export function articleValidationCheck(validation: IArticleExistMessage) {

    Cart.findById(validation.cartId, function (err: any, cart: ICart) {
        if (err) return;

        if (cart) {
            const article = cart.articles.find(element => element.articleId === validation.articleId);

            if (validation.valid) {
                article.validated = true;
            } else {
                cart.removeArticle(article);
            }
            // Save the Cart
            cart.save(function (err: any) {
            });
        }
    });
}
