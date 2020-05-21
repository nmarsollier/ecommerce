import axios from "axios";
import { environment } from "../system/environment/environment";

axios.defaults.headers.common["Content-Type"] = "application/json";

export interface IOrderList {
    id: string;
    status: string;
    cartId: string;
    created: string;
    updated: string;
    articles: number;
    totalPrice: number;
    totalPayment: number;
}

export interface IOrder {
    id: string;
    status: string;
    cartId: string;
    totalPrice: number;
    created: string;
    updated: string;
    totalPayment: number;
    articles: IArticle[];
    payment: IPayment[];
}

export interface IArticle {
    id: string;
    quantity: number;
    unitaryPrice: number;
    valid: boolean;
    validated: boolean;
}

export interface IPayment {
    method: string;
    amount: number;
}

export async function getOrder(orderId: string): Promise<IOrder> {
    try {
        const res = await axios.get(environment.orderServerUrl + "orders/" + orderId);
        return Promise.resolve(res.data);
    } catch (err) {
        return Promise.reject(err);
    }
}

export async function addPayment(orderId: string, method: string, amount: number): Promise<IOrder> {
    try {
        const res = await axios.post(environment.orderServerUrl + "orders/" + orderId + "/payment",
            {
                amount,
                method,
            });
        return Promise.resolve(res.data);
    } catch (err) {
        return Promise.reject(err);
    }
}

export async function batchPlaced(): Promise<void> {
    try {
        const res = await axios.get(environment.orderServerUrl + "orders_batch/placed");
        return Promise.resolve(res.data);
    } catch (err) {
        return Promise.reject(err);
    }
}

export async function batchValidated(): Promise<void> {
    try {
        const res = await axios.get(environment.orderServerUrl + "orders_batch/validated");
        return Promise.resolve(res.data);
    } catch (err) {
        return Promise.reject(err);
    }
}

export async function batchPaymentDefined(): Promise<void> {
    try {
        const res = await axios.get(environment.orderServerUrl + "orders_batch/payment_defined");
        return Promise.resolve(res.data);
    } catch (err) {
        return Promise.reject(err);
    }
}

export async function getOrders(): Promise<IOrderList[]> {
    try {
        const res = await axios.get(environment.orderServerUrl + "orders");
        return Promise.resolve(res.data);
    } catch (err) {
        return Promise.reject(err);
    }
}
