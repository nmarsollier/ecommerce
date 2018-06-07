"use strict";

import { NextFunction } from "express-serve-static-core";

import * as express from "express";
import * as error from "../utils/error";
import { IUserSessionRequest } from "../utils/security";
import { ICart, Cart, ICartArticle } from "./cart.schema";

export interface ICartRequest extends IUserSessionRequest {
    cart: ICart;
}

export function findCurrentCart(req: ICartRequest, res: express.Response, next: NextFunction) {
    Cart.findOne({
        userId: req.user.user.id,
        enabled: true
    }, function (err: any, cart: ICart) {
        if (err) return error.handleError(res, err);

        req.cart = cart;
        if (!req.cart) {
            req.cart = new Cart();
            req.cart.userId = req.user.user.id;
            req.cart.save(function (err: any) {
                if (err) return error.handleError(res, err);
                next();
            });
        } else {
            next();
        }
    });
}

export function validateAddArticle(req: ICartRequest, res: express.Response, next: NextFunction) {
    req.check("articleId", "No puede quedar vac&iacute;o.").notEmpty();
    req.check("quantity", "Debe se numerico").isInt({ min: 1 });

    req.getValidationResult().then(function (result) {
        if (!result.isEmpty()) {
            return error.handleExpressValidationError(res, result);
        }
        next();
    });
}


/**
 * @api {post} /cart/article AddArticle
 * @apiName Add Article
 * @apiGroup Carrito
 *
 * @apiDescription Agregar articulos al carrito.
 *
 * @apiParamasExample {json} Body
 *    {
 *      "articleId": "{Article Id}",
 *      "quantity": {Quantity to add}
 *    }
 *
 * @apiSuccessExample {json} Body
 *    {
 *      "userId": "{User Id}",
 *      "enabled": true|false,
 *      "_id": "{Id de carrito}",
 *      "articles": [{Articulos}],
 *      "updated": "{Fecha ultima actualizacion}",
 *      "created": "{Fecha creado}"
 *    }
 *
 * @apiUse ParamValidationErrors
 * @apiUse OtherErrors
 */
export function addArticle(req: ICartRequest, res: express.Response) {
    const cart = req.cart;

    const article: ICartArticle = {
        articleId: req.body.articleId,
        quantity: req.body.quantity
    };

    cart.addArticle(article);

    // Save the Cart
    cart.save(function (err: any) {
        if (err) return error.handleError(res, err);

        res.json(cart);
    });
}

/**
 * @api {post} /cart/article/:articleId/decrement DecrementArticleCart
 * @apiName Decrement Article Cart
 * @apiGroup Carrito
 *
 * @apiDescription Decrementa la cantidad de articulos en el cart.
 *
 * @apiSuccessExample {json} Body
 *    {
 *      "articleId": "{Article Id}",
 *      "quantity": {articles to decrement}
 *    }
 *
 * @apiSuccessExample {json} Body
 *    {
 *      "userId": "{User Id}",
 *      "enabled": true|false,
 *      "_id": "{Id de carrito}",
 *      "articles": [{Articulos}],
 *      "updated": "{Fecha ultima actualizacion}",
 *      "created": "{Fecha creado}"
 *    }
 *
 * @apiUse ParamValidationErrors
 * @apiUse OtherErrors
 */
export function decrementArticle(req: ICartRequest, res: express.Response) {
    const cart = req.cart;
    const articleId = escape(req.params.articleId);

    const article: ICartArticle = {
        articleId: articleId,
        quantity: req.body.quantity
    };

    cart.decrementArticle(article);

    // Save the Cart
    cart.save(function (err: any) {
        if (err) return error.handleError(res, err);

        res.json(cart);
    });
}

/**
 * @api {post} /cart/article/:articleId/increment IncrementArticleCart
 * @apiName Increment Article Cart
 * @apiGroup Carrito
 *
 * @apiDescription Incrementa la cantidad de articulos en el cart.
 *
 * @apiSuccessExample {json} Body
 *    {
 *      "articleId": "{Article Id}",
 *      "quantity": {articles to increment}
 *    }
 *
 * @apiSuccessExample {json} Body
 *    {
 *      "userId": "{User Id}",
 *      "enabled": true|false,
 *      "_id": "{Id de carrito}",
 *      "articles": [{Articulos}],
 *      "updated": "{Fecha ultima actualizacion}",
 *      "created": "{Fecha creado}"
 *    }
 *
 * @apiUse ParamValidationErrors
 * @apiUse OtherErrors
 */
export function incrementArticle(req: ICartRequest, res: express.Response) {
    const cart = req.cart;
    const articleId = escape(req.params.articleId);

    const article: ICartArticle = {
        articleId: articleId,
        quantity: req.body.quantity
    };

    cart.addArticle(article);

    // Save the Cart
    cart.save(function (err: any) {
        if (err) return error.handleError(res, err);

        res.json(cart);
    });
}

/**
 * @api {get} /cart GetCart
 * @apiName Get Cart
 * @apiGroup Carrito
 *
 * @apiDescription Devuelve el carrito activo.
 *
 * @apiSuccessExample {json} Body
 *    {
 *      "userId": "{User Id}",
 *      "enabled": true|false,
 *      "_id": "{Id de carrito}",
 *      "articles": [{Articulos}],
 *      "updated": "{Fecha ultima actualizacion}",
 *      "created": "{Fecha creado}"
 *    }
 *
 * @apiUse ParamValidationErrors
 * @apiUse OtherErrors
 */
export function getCurrentCart(req: ICartRequest, res: express.Response) {
    res.json(req.cart);
}

export function validateDelete(req: ICartRequest, res: express.Response, next: NextFunction) {
    next();
}

/**
 * @api {delete} /cart/article/:articleId DeleteCartArticle
 * @apiName Delete Cart
 * @apiGroup Carrito
 *
 * @apiDescription Eliminar un articulo del carrito.
 *
 * @apiSuccessExample {string} Body
 *    HTTP/1.1 200 Ok
 *
 * @apiUse ParamValidationErrors
 * @apiUse OtherErrors
 */
export function deleteArticle(req: ICartRequest, res: express.Response) {
    const cart = req.cart;
    const articleId = escape(req.params.articleId);

    const article: ICartArticle = {
        articleId: articleId,
        quantity: 0
    };

    cart.removeArticle(article);

    // Save the Cart
    cart.save(function (err: any) {
        if (err) return error.handleError(res, err);

        res.send();
    });
}

export function validateOrder(req: ICartRequest, res: express.Response, next: NextFunction) {
    next();
}

/**
 * @api {post} /cart/checkout CheckoutCart
 * @apiName Checkout Cart
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
export function postOrder(req: ICartRequest, res: express.Response) {
    const cart = req.cart;

    cart.orderId = "orderID";
    cart.enabled = false;
    // Save the Cart
    cart.save(function (err: any) {
        if (err) return error.handleError(res, err);

        res.json(req.cart);
    });
}
