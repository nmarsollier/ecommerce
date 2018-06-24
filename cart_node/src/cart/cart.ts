"use strict";

import * as async from "async";
import { RestClient } from "typed-rest-client/RestClient";
import * as env from "../server/environment";
import * as error from "../server/error";
import { Cart, ICart, ICartArticle } from "./schema";
import { sendArticleValidation, sendPlaceOrder } from "../rabbit/cartService";

const conf = env.getConfig(process.env);

interface CartValidationItem {
    articleId: string;
    message: string;
}
interface ICartValidation {
    errors: CartValidationItem[];
    warnings: CartValidationItem[];
}

export function currentCart(userId: string): Promise<ICart> {
    return new Promise((resolve, reject) => {
        Cart.findOne({
            userId: userId,
            enabled: true
        }, function (err: any, cart: ICart) {
            if (err) return reject(err);

            if (!cart) {
                const result = new Cart();
                result.userId = userId;
                result.save(function (err: any) {
                    if (err) return reject(err);
                    resolve(result);
                });
            } else {
                new Promise((result, reject) => {
                    cart.articles.forEach(article => {
                        if (!article.validated) {
                            sendArticleValidation(cart._id, article.articleId).then();
                        }
                    });
                }).catch(err => console.log(err));
                resolve(cart);
            }
        });
    });
}

interface AddArticleRequest {
    articleId?: string;
    quantity?: number;
}
export async function addArticle(userId: string, body: AddArticleRequest): Promise<ICart> {
    try {
        body = await validateAddArticle(body);
        const cart = await currentCart(userId);
        const article: ICartArticle = {
            articleId: body.articleId,
            quantity: body.quantity
        };

        cart.addArticle(article);

        // Save the Cart
        return new Promise<ICart>((resolve, reject) => {
            cart.save(function (err: any) {
                if (err) return reject(err);

                resolve(cart);
            });
        });
    } catch (err) {
        return Promise.reject(err);
    }
}

export async function decrementArticle(userId: string, body: AddArticleRequest): Promise<ICart> {
    try {
        body = await validateAddArticle(body);
        const cart = await currentCart(userId);
        const article: ICartArticle = {
            articleId: body.articleId,
            quantity: body.quantity
        };

        cart.decrementArticle(article);

        // Save the Cart
        return new Promise<ICart>((resolve, reject) => {
            cart.save(function (err: any) {
                if (err) return reject(err);

                resolve(cart);
            });
        });
    } catch (err) {
        return Promise.reject(err);
    }
}

function validateAddArticle(body: AddArticleRequest): Promise<AddArticleRequest> {
    const result: error.ValidationErrorMessage = {
        messages: []
    };

    if (!body.articleId) {
        result.messages.push({ path: "articleId", message: "No puede quedar vacío." });
    }

    if (!body.quantity || body.quantity <= 0) {
        result.messages.push({ path: "quantity", message: "Debe se numérico." });
    }

    if (result.messages.length > 0) {
        return Promise.reject(result);
    }
    return Promise.resolve(body);
}

export async function deleteArticle(userId: string, articleId: string): Promise<void> {
    try {
        const cart = await currentCart(userId);

        cart.removeArticle(articleId);

        // Save the Cart
        return new Promise<void>((resolve, reject) => {
            cart.save(function (err: any) {
                if (err) return reject(err);

                resolve();
            });
        });
    } catch (err) {
        return Promise.reject(err);
    }
}

/**
 * Esta validación es muy cara porque valida todo contra otros servicios en forma síncrona.
 */
interface Article {
    "_id": string;
    "name": string;
    "price": number;
    "stock": number;
    "enabled": boolean;
}
export function validateCheckout(userId: string, token: string): Promise<ICartValidation> {
    return new Promise((resolve, reject) => {
        currentCart(userId)
            .then(cart => {
                async.map(cart.articles,
                    (article: ICartArticle, callback) => {
                        const restClient: RestClient = new RestClient("GetArticle", conf.catalogServer);
                        restClient.get<any>("/v1/articles/" + article.articleId,
                            { additionalHeaders: { "Authorization": token } }).then(
                                (data) => {
                                    callback(undefined, data.result as Article);
                                }
                            ).catch(
                                (exception) => {
                                    callback(undefined, { "_id": undefined });
                                }
                            );
                    },
                    (err, results: Article[]) => {
                        if (err) {
                            return reject(err);
                        }

                        const validation: ICartValidation = {
                            errors: [],
                            warnings: []
                        };

                        cart.articles.map((article) => {
                            return {
                                article: article,
                                result: results.find(element => element._id == article.articleId)
                            };
                        }).forEach(element => {
                            if (!element.result) {
                                validation.errors.push({
                                    articleId: element.article.articleId,
                                    message: "No se encuentra"
                                });
                            } else if (!element.result.enabled) {
                                validation.errors.push({
                                    articleId: element.article.articleId,
                                    message: "Articulo inválido"
                                });
                            } else {
                                if (element.result.stock < element.article.quantity) {
                                    validation.warnings.push({
                                        articleId: element.article.articleId,
                                        message: "Insuficiente stock"
                                    });
                                }
                            }
                        });

                        resolve(validation);
                    });
            }).catch(err => reject(err));
    });
}

/**
 * @api {post} /v1/cart/checkout Checkout
 * @apiName Checkout
 * @apiGroup Carrito
 *
 * @apiDescription Realiza el checkout del carrito.
 *
 * @apiSuccessExample {string} Body
 *    HTTP/1.1 200 Ok
 *
 * @apiUse ParamValidationErrors
 * @apiUse OtherErrors
 */
export function placeOrder(userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
        currentCart(userId)
            .then(cart => {
                cart.enabled = false;
                // Save the Cart
                cart.save(function (err: any) {
                    if (err) return reject(err);

                    sendPlaceOrder(cart);
                    resolve();
                });
            }).catch(err => reject(err));
    });
}
