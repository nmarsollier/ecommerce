import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { AuthService, Usuario } from '../auth/auth.service';
import { IErrorController } from '../tools/error.handler';
import * as errorHanlder from '../tools/error.handler';
import { Cart, CartService } from './cart.service';

@Component({
    selector: 'app-current-cart',
    templateUrl: './current.cart.component.html'
})
export class CurrentCartComponent implements errorHanlder.IErrorController, OnInit {
    errorMessage: string;
    errors: Map<string, string>;

    @Input()
    currentCart: Cart;

    constructor(private cartService: CartService, private router: Router) { }

    ngOnInit(): void {
        this.refresh();
    }

    refresh() {
        this.cartService.getCurrentCart()
            .then(result => this.currentCart = result)
            .catch(error => errorHanlder.procesarValidacionesRest(this, error));
    }
    checkout() {
        this.cartService.checkout()
            .then(_ => this.refresh())
            .catch(error => errorHanlder.procesarValidacionesRest(this, error));
    }
}
