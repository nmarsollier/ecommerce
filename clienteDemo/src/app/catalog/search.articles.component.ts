import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { AuthService, Usuario, RegistrarUsuario } from '../auth/auth.service';
import { IErrorController } from '../tools/error.handler';
import * as errorHanlder from '../tools/error.handler';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Articulo, CatalogService } from './catalog.service';

@Component({
    selector: 'app-catalog-search-articles',
    templateUrl: './search.articles.component.html'
})
export class SearchArticleaComponent implements errorHanlder.IErrorController {
    errorMessage: string;
    errors = new Map();

    filter = new FormControl('', [Validators.required]);

    articulos: Articulo[];

    constructor(private catalogService: CatalogService, private router: Router) { }

    submitForm() {
        errorHanlder.cleanRestValidations(this);

        this.catalogService.buscarArticulos(this.filter.value).then(
            result => this.articulos = result
        ).catch(err => errorHanlder.procesarValidacionesRest(this, err));
    }
}
