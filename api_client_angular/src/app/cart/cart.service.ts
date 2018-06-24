import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from '../../environments/environment';
import { RestBaseService } from '../tools/rest.tools';

export interface CartValidationItem {
    articleId: string;
    message: string;
  }
export interface ICartValidation {
    errors: CartValidationItem[];
    warnings: CartValidationItem[];
}

@Injectable()
export class CartService extends RestBaseService {
    constructor(private http: Http) {
        super();
    }

    getCurrentCart(): Promise<Cart> {
        return this.http
            .get(environment.cartServerUrl + 'cart', this.getRestHeader())
            .toPromise()
            .then(response => {
                return response.json() as Cart;
            })
            .catch(this.handleError);
    }

    validate(): Promise<ICartValidation> {
        return this.http
            .get(environment.cartServerUrl + 'cart/validate', this.getRestHeader())
            .toPromise()
            .then(response => {
                return response.json() as ICartValidation;
            })
            .catch(this.handleError);
    }

    checkout(): Promise<string> {
        return this.http
            .post(environment.cartServerUrl + 'cart/checkout', '', this.getRestHeader())
            .toPromise()
            .then(response => {
                return '';
            })
            .catch(this.handleError);
    }

    addArticle(article: Article): Promise<Cart> {
        return this.http
            .post(
                environment.cartServerUrl + 'cart/article',
                JSON.stringify(article),
                this.getRestHeader()
            )
            .toPromise()
            .then(response => {
                return response.json() as Cart;
            })
            .catch(this.handleError);
    }

    incrementArticle(articleId: string): Promise<Cart> {
        return this.http
            .post(
                environment.cartServerUrl + 'cart/article/' + articleId + '/increment',
                JSON.stringify({ articleId: articleId, quantity: 1 }),
                this.getRestHeader()
            )
            .toPromise()
            .then(response => {
                return response.json() as Cart;
            })
            .catch(this.handleError);
    }

    decrementArticle(articleId: string): Promise<Cart> {
        return this.http
            .post(
                environment.cartServerUrl + 'cart/article/' + articleId + '/decrement',
                JSON.stringify({ articleId: articleId, quantity: 1 }),
                this.getRestHeader()
            )
            .toPromise()
            .then(response => {
                return response.json() as Cart;
            })
            .catch(this.handleError);
    }

    deleteArticle(articleId: string): Promise<string> {
        return this.http
            .delete(
                environment.cartServerUrl + 'cart/article/' + articleId,
                this.getRestHeader()
            )
            .toPromise()
            .then(response => {
                return '';
            })
            .catch(this.handleError);
    }
}

export interface Cart {
    _id: string;
    userId: string;
    orderId?: string;
    enabled: string;
    articles?: Article[];
}


export interface Article {
    articleId: string;
    quantity: number;
    validated?: boolean;
}
