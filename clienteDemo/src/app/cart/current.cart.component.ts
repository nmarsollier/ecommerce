import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as errorHandler from '../tools/error.handler';
import { Cart, CartService, ICartValidation } from './cart.service';

@Component({
    selector: 'app-current-cart',
    templateUrl: './current.cart.component.html'
})
export class CurrentCartComponent implements errorHandler.IErrorController, OnInit {
    errorMessage: string;
    errors: Map<string, string>;

    validation: ICartValidation;

    @Input()
    currentCart: Cart;

    constructor(private cartService: CartService, private router: Router) { }

    ngOnInit(): void {
        this.refresh();
    }

    refresh() {
        this.cartService.getCurrentCart()
            .then(result => this.currentCart = result)
            .catch(error => errorHandler.processRestValidations(this, error));
    }

    checkout() {
        this.cartService.checkout()
            .then(_ => this.refresh())
            .catch(error => errorHandler.processRestValidations(this, error));
    }

    validate() {
        this.cartService.validate()
            .then(validation => this.validation = validation)
            .catch(error => errorHandler.processRestValidations(this, error));
    }

}
