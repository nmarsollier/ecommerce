import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as errorHandler from '../tools/error.handler';
import { Cart, CartService } from './cart.service';

@Component({
    selector: 'app-catalog-edit-article',
    templateUrl: './add.article.cart.component.html'
})
export class AddArticleCartComponent implements errorHandler.IFormGroupErrorController, OnInit {
    errorMessage: string;
    errors = new Map();

    form = new FormGroup({
        articleId: new FormControl('', [Validators.required]),
        quantity: new FormControl('')
    });

    currentCart: Cart;

    constructor(private cartService: CartService, private router: Router, private route: ActivatedRoute) { }

    addArticle() {
        errorHandler.cleanRestValidations(this);

        this.cartService
            .addArticle({
                articleId: this.form.get('articleId').value,
                quantity: this.form.get('quantity').value
            })
            .then(cart => {
                this.currentCart = cart;
            })
            .catch(error => errorHandler.processFormGroupRestValidations(this, error));
    }


    deleteArticle() {
        errorHandler.cleanRestValidations(this);

        this.cartService
            .deleteArticle(this.form.get('articleId').value)
            .then(_ => {
                this.refresh();
            })
            .catch(error => errorHandler.processFormGroupRestValidations(this, error));
    }

    incrementArticle() {
        errorHandler.cleanRestValidations(this);

        this.cartService
            .incrementArticle(this.form.get('articleId').value)
            .then(_ => {
                this.refresh();
            })
            .catch(error => errorHandler.processFormGroupRestValidations(this, error));
    }

    decrementArticle() {
        errorHandler.cleanRestValidations(this);

        this.cartService
            .decrementArticle(this.form.get('articleId').value)
            .then(_ => {
                this.refresh();
            })
            .catch(error => errorHandler.processFormGroupRestValidations(this, error));
    }

    ngOnInit(): void {
        this.refresh();
    }

    refresh() {
        this.cartService.getCurrentCart()
            .then(result => this.currentCart = result)
            .catch(error => errorHandler.processFormGroupRestValidations(this, error));
    }
}
