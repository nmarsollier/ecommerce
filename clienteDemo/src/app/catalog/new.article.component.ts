import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { AuthService, Usuario, RegistrarUsuario } from '../auth/auth.service';
import { IErrorController } from '../tools/error.handler';
import * as errorHanlder from '../tools/error.handler';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CatalogService } from './catalog.service';

@Component({
    selector: 'app-catalog-new-article',
    templateUrl: './new.article.component.html'
})
export class NewArticleComponent implements errorHanlder.IFormGroupErrorController {
    errorMessage: string;
    errors = new Map();

    form = new FormGroup({
        name: new FormControl('', [Validators.required]),
        description: new FormControl(''),
        image: new FormControl(''),
        price: new FormControl('0'),
        stock: new FormControl('0'),
    });

    constructor(private catalogService: CatalogService, private router: Router) { }

    submitForm() {
        errorHanlder.cleanRestValidations(this);

        this.catalogService
            .nuevoArticulo({
                name: this.form.get('name').value,
                description: this.form.get('description').value,
                image: this.form.get('image').value,
                price: Number(this.form.get('price').value),
                stock: Number(this.form.get('stock').value)
            }).then(principal => {
                this.router.navigate(['/']);
            })
            .catch(error => errorHanlder.procesarValidacionesRestFormGroup(this, error));
    }
}
