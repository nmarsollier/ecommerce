import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as errorHandler from '../tools/error.handler';
import { Article, CatalogService } from './catalog.service';

@Component({
    selector: 'app-catalog-search-articles',
    templateUrl: './search.articles.component.html'
})
export class SearchArticleComponent implements errorHandler.IErrorController {
    errorMessage: string;
    errors = new Map();

    filter = new FormControl('', [Validators.required]);

    articles: Article[];

    constructor(private catalogService: CatalogService, private router: Router) { }

    submitForm() {
        errorHandler.cleanRestValidations(this);

        this.catalogService.findArticles(this.filter.value).then(
            result => this.articles = result
        ).catch(err => errorHandler.processRestValidations(this, err));
    }
}
