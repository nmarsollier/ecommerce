import { Component } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Article, CatalogService } from './catalog.service';
import { BasicFromGroupController } from '../tools/error.form';

@Component({
    selector: 'app-catalog-search-articles',
    templateUrl: './search.articles.component.html'
})
export class SearchArticleComponent extends BasicFromGroupController {
    form = new FormGroup({
        filter: new FormControl('', [Validators.required]),
    });

    articles: Article[];

    constructor(private catalogService: CatalogService, private router: Router) {
        super();
    }

    submitForm() {
        this.cleanRestValidations();

        this.catalogService.findArticles(this.form.get('filter').value).then(
            result => this.articles = result
        ).catch(err => this.processRestValidations(err));
    }
}
