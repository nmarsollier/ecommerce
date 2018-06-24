import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ImageService } from '../image/image.service';
import * as errorHandler from '../tools/error.handler';
import { CatalogService } from './catalog.service';

@Component({
    selector: 'app-catalog-new-article',
    templateUrl: './new.article.component.html'
})
export class NewArticleComponent implements errorHandler.IFormGroupErrorController {
    errorMessage: string;
    errors = new Map();
    imagen: string;

    form = new FormGroup({
        name: new FormControl('', [Validators.required]),
        description: new FormControl(''),
        image: new FormControl('/assets/select_image.png'),
        price: new FormControl('0'),
        stock: new FormControl('0'),
    });

    constructor(private catalogService: CatalogService, private imageService: ImageService, private router: Router) { }

    updateImage(imagen: string) {
        this.imagen = imagen;
        this.form.get('image').setValue(imagen);
    }

    submitForm() {
        errorHandler.cleanRestValidations(this);

        if (this.imagen) {
            this.imageService.saveImage({ image: this.imagen }).then(
                imagen => {
                    this.catalogService
                        .newArticle({
                            name: this.form.get('name').value,
                            description: this.form.get('description').value,
                            image: imagen.id,
                            price: Number(this.form.get('price').value),
                            stock: Number(this.form.get('stock').value)
                        }).then(principal => {
                            this.router.navigate(['/']);
                        })
                        .catch(error => errorHandler.processFormGroupRestValidations(this, error));
                }
            ).catch(error => errorHandler.processFormGroupRestValidations(this, error));
        } else {
            this.catalogService
                .newArticle({
                    name: this.form.get('name').value,
                    description: this.form.get('description').value,
                    price: Number(this.form.get('price').value),
                    stock: Number(this.form.get('stock').value)
                }).then(principal => {
                    this.router.navigate(['/']);
                })
                .catch(error => errorHandler.processFormGroupRestValidations(this, error));
        }
    }
}
