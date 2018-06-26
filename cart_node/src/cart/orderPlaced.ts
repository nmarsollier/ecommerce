"use strict";
/**
 * Servicios internos de Cart, normalmente son llamados por procesos Rabbit o background
 */

import { Cart, ICart } from "./schema";

export interface IOrderPlaced {
    cartId: string;
    orderId: string;
}

/**
 * Procesa una validación realizada a través de rabbit.
 * Si un articulo no es valido se elimina del cart.
 */
export function orderPlaced(data: IOrderPlaced) {
    console.log("RabbitMQ Consume OrderPlaced : " + data.cartId + " - " + data.orderId);

    Cart.findById(data.cartId, function (err: any, cart: ICart) {
        if (err) return;

        if (cart) {
            cart.orderId = data.orderId;

            // Save the Cart
            cart.save(function (err: any) {
            });
        }
    });
}
