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
    if (validation.valid) {
        return;
    }
    Cart.findById(validation.cartId, function (err: any, cart: ICart) {
        if (err) return;

        if (cart) {
            const article: ICartArticle = {
                articleId: validation.articleId,
                quantity: 0
            };

            cart.removeArticle(article);

            // Save the Cart
            cart.save(function (err: any) {
            });
        }
    });
}
