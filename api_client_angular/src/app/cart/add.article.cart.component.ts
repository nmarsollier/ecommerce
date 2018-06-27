import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BasicFromGroupController } from '../tools/error.form';
import { Cart, CartService } from './cart.service';

@Component({
    selector: 'app-catalog-edit-article',
    templateUrl: './add.article.cart.component.html'
})
export class AddArticleCartComponent extends BasicFromGroupController implements OnInit {
    form = new FormGroup({
        articleId: new FormControl('', [Validators.required]),
        quantity: new FormControl('')
    });

    currentCart: Cart;

    constructor(private cartService: CartService, private router: Router, private route: ActivatedRoute) {
        super();
    }

    addArticle() {
        this.cleanRestValidations();

        this.cartService
            .addArticle({
                articleId: this.form.get('articleId').value,
                quantity: this.form.get('quantity').value
            })
            .then(cart => {
                this.currentCart = cart;
            })
            .catch(error => this.processRestValidations(error));
    }


    deleteArticle() {
        this.cleanRestValidations();

        this.cartService
            .deleteArticle(this.form.get('articleId').value)
            .then(_ => {
                this.refresh();
            })
            .catch(error => this.processRestValidations(error));
    }

    incrementArticle() {
        this.cleanRestValidations();

        this.cartService
            .incrementArticle(this.form.get('articleId').value)
            .then(_ => {
                this.refresh();
            })
            .catch(error => this.processRestValidations(error));
    }

    decrementArticle() {
        this.cleanRestValidations();

        this.cartService
            .decrementArticle(this.form.get('articleId').value)
            .then(_ => {
                this.refresh();
            })
            .catch(error => this.processRestValidations(error));
    }

    ngOnInit(): void {
        this.refresh();
    }

    refresh() {
        this.cartService.getCurrentCart()
            .then(result => this.currentCart = result)
            .catch(error => this.processRestValidations(error));
    }
}
