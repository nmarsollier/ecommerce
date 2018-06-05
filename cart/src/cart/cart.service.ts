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
            req.cart = <ICart>new Cart();
            req.cart.userId = req.user.user.id;
        }
        next();
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


export function incrementArticle(req: ICartRequest, res: express.Response) {
    const cart = req.cart;

    const article: ICartArticle = {
        articleId: req.body.articleId,
        quantity: req.body.quantity
    };

    cart.incrementArticle(article);

    // Save the Cart
    cart.save(function (err: any) {
        if (err) return error.handleError(res, err);

        res.json(cart);
    });
}


export function decrementArticle(req: ICartRequest, res: express.Response) {
    const cart = req.cart;

    const article: ICartArticle = {
        articleId: req.body.articleId,
        quantity: req.body.quantity
    };

    cart.decrementArticle(article);

    // Save the Cart
    cart.save(function (err: any) {
        if (err) return error.handleError(res, err);

        res.json(cart);
    });
}

export function getCurrentCart(req: ICartRequest, res: express.Response) {
    res.json(req.cart);
}

export function validateDelete(req: ICartRequest, res: express.Response, next: NextFunction) {
    next();
}

export function deleteArticle(req: ICartRequest, res: express.Response) {
    const cart = req.cart;

    const article: ICartArticle = {
        articleId: req.body.articleId,
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