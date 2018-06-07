import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { AuthService, Usuario, RegistrarUsuario } from '../auth/auth.service';
import { IErrorController } from '../tools/error.handler';
import * as errorHanlder from '../tools/error.handler';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CartService, Cart } from './cart.service';

@Component({
    selector: 'app-catalog-edit-article',
    templateUrl: './add.article.cart.component.html'
})
export class AddArticleCartComponent implements errorHanlder.IFormGroupErrorController, OnInit {
    errorMessage: string;
    errors = new Map();

    form = new FormGroup({
        articleId: new FormControl('', [Validators.required]),
        quantity: new FormControl('')
    });

    currentCart: Cart;

    constructor(private cartService: CartService, private router: Router, private route: ActivatedRoute) { }

    agregar() {
        errorHanlder.cleanRestValidations(this);

        this.cartService
            .addArticle({
                articleId: this.form.get('articleId').value,
                quantity: this.form.get('quantity').value
            })
            .then(cart => {
                this.currentCart = cart;
            })
            .catch(error => errorHanlder.procesarValidacionesRestFormGroup(this, error));
    }


    eliminar() {
        errorHanlder.cleanRestValidations(this);

        this.cartService
            .deleteArticle(this.form.get('articleId').value)
            .then(_ => {
                this.refresh();
            })
            .catch(error => errorHanlder.procesarValidacionesRestFormGroup(this, error));
    }

    incrementar() {
        errorHanlder.cleanRestValidations(this);

        this.cartService
            .incrementArticle(this.form.get('articleId').value)
            .then(_ => {
                this.refresh();
            })
            .catch(error => errorHanlder.procesarValidacionesRestFormGroup(this, error));
    }

    decrementar() {
        errorHanlder.cleanRestValidations(this);

        this.cartService
            .decrementArticle(this.form.get('articleId').value)
            .then(_ => {
                this.refresh();
            })
            .catch(error => errorHanlder.procesarValidacionesRestFormGroup(this, error));
    }

    ngOnInit(): void {
        this.refresh();
    }

    refresh() {
        this.cartService.getCurrentCart()
            .then(result => this.currentCart = result)
            .catch(error => errorHanlder.procesarValidacionesRestFormGroup(this, error));
    }
}
