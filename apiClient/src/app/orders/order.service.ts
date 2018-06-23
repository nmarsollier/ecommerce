import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from '../../environments/environment';
import { RestBaseService } from '../tools/rest.tools';

@Injectable()
export class OrderService extends RestBaseService {
    constructor(private http: Http) {
        super();
    }

    getOrder(orderId: string): Promise<Order> {
        return this.http
            .get(environment.orderServerUrl + 'orders/' + orderId, this.getRestHeader())
            .toPromise()
            .then(response => {
                return response.json() as Order;
            })
            .catch(this.handleError);
    }

    addPayment(orderId: string, method: string, amount: string): Promise<void> {
        return this.http
            .post(environment.orderServerUrl + 'orders/' + orderId + '/payment',
                {
                    'method': method,
                    'amount': parseFloat(amount),
                },
                this.getRestHeader())
            .toPromise()
            .then(response => {
                return undefined;
            })
            .catch(this.handleError);
    }

    batchPlaced(): Promise<void> {
        return this.http
            .get(environment.orderServerUrl + 'orders_batch/placed', this.getRestHeader())
            .toPromise()
            .then(response => {
                return undefined;
            })
            .catch(this.handleError);
    }

    batchValidated(): Promise<void> {
        return this.http
            .get(environment.orderServerUrl + 'orders_batch/validated', this.getRestHeader())
            .toPromise()
            .then(response => {
                return undefined;
            })
            .catch(this.handleError);
    }

    batchPaymentDefined(): Promise<void> {
        return this.http
            .get(environment.orderServerUrl + 'orders_batch/payment_defined', this.getRestHeader())
            .toPromise()
            .then(response => {
                return undefined;
            })
            .catch(this.handleError);
    }

    getOrders(): Promise<OrderList[]> {
        return this.http
            .get(environment.orderServerUrl + 'orders', this.getRestHeader())
            .toPromise()
            .then(response => {
                return response.json() as OrderList[];
            })
            .catch(this.handleError);
    }
}

export interface OrderList {
    id: string;
    status: string;
    cartId: string;
    created: string;
    updated: string;
    articles: number;
    totalPrice: number;
    totalPayment: number;
}

export interface Order {
    id: string;
    status: string;
    cartId: string;
    totalPrice: number;
    created: string;
    updated: string;
    totalPayment: number;
    articles: Article[];
    payment: Payment[];
}

export interface Article {
    id: string;
    quantity: number;
    unitaryPrice: number;
    valid: boolean;
    validated: boolean;
}

export interface Payment {
    method: string;
    amount: number;
}
