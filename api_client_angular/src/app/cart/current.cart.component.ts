import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cart, CartService, ICartValidation } from './cart.service';
import { BasicFromGroupController } from '../tools/error.form';

@Component({
    selector: 'app-current-cart',
    templateUrl: './current.cart.component.html'
})
export class CurrentCartComponent extends BasicFromGroupController implements OnInit {
    validation: ICartValidation;

    @Input()
    currentCart: Cart;

    constructor(private cartService: CartService, private router: Router) {
        super();
    }

    ngOnInit(): void {
        this.refresh();
    }

    refresh() {
        this.cartService.getCurrentCart()
            .then(result => this.currentCart = result)
            .catch(error => this.processRestValidations(error));
    }

    checkout() {
        this.cartService.checkout()
            .then(_ => this.refresh())
            .catch(error => this.processRestValidations(error));
    }

    validate() {
        this.cartService.validate()
            .then(validation => this.validation = validation)
            .catch(error => this.processRestValidations(error));
    }

}
