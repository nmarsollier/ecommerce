import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { AuthService, Usuario, RegistrarUsuario } from '../auth/auth.service';
import { IErrorController } from '../tools/error.handler';
import * as errorHanlder from '../tools/error.handler';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CatalogService, Articulo } from './catalog.service';
import { ImageService, Calidad } from '../image/image.service';

@Component({
    selector: 'app-catalog-edit-article',
    templateUrl: './edit.article.component.html'
})
export class EditArticleComponent implements errorHanlder.IFormGroupErrorController {
    errorMessage: string;
    errors = new Map();

    articleId = new FormControl('', [Validators.required]);
    articulo: Articulo;
    nuevaImagen: string;

    form = new FormGroup({
        name: new FormControl('', [Validators.required]),
        description: new FormControl(''),
        image: new FormControl('/assets/select_image.png'),
        price: new FormControl('0'),
        stock: new FormControl('0'),
    });

    constructor(private catalogService: CatalogService, private imageService: ImageService, private router: Router) { }

    buscar() {
        errorHanlder.cleanRestValidations(this);

        this.catalogService
            .buscarArticulo(this.articleId.value)
            .then(articulo => {
                this.articulo = articulo;
                this.form.get('name').setValue(articulo.name);
                this.form.get('description').setValue(articulo.description);
                this.form.get('price').setValue(articulo.price);
                this.form.get('stock').setValue(articulo.stock);

                if (articulo.image) {
                    this.imageService.buscarImagen(this.articulo.image, Calidad.Q160)
                        .then(
                            imagen => {
                                this.form.get('image').setValue(imagen.image);
                            }
                        )
                        .catch(error => this.form.get('image').setValue('/assets/not_found.png'));
                }
            })
            .catch(error => errorHanlder.procesarValidacionesRestFormGroup(this, error));
    }


    actualizarImagen(imagen: string) {
        this.nuevaImagen = imagen;
        this.form.get('image').setValue(imagen);
    }

    submitForm() {
        errorHanlder.cleanRestValidations(this);

        if (this.nuevaImagen) {
            this.imageService.guardarImagen({ image: this.nuevaImagen }).then(
                imagen => {
                    this.articulo.image = imagen.id;

                    this.catalogService
                        .actualizarArticulo(this.articulo._id, {
                            name: this.form.get('name').value,
                            description: this.form.get('description').value,
                            image: this.articulo.image,
                            price: Number(this.form.get('price').value),
                            stock: Number(this.form.get('stock').value)
                        }).then(articulo => {
                            this.router.navigate(['/']);
                        })
                        .catch(error => errorHanlder.procesarValidacionesRestFormGroup(this, error));
                })
                .catch(error => errorHanlder.procesarValidacionesRestFormGroup(this, error));
        } else {

            this.catalogService
                .actualizarArticulo(this.articulo._id, {
                    name: this.form.get('name').value,
                    description: this.form.get('description').value,
                    image: this.articulo.image,
                    price: Number(this.form.get('price').value),
                    stock: Number(this.form.get('stock').value)
                }).then(articulo => {
                    this.router.navigate(['/']);
                })
                .catch(error => errorHanlder.procesarValidacionesRestFormGroup(this, error));
        }
    }

    eliminar() {
        errorHanlder.cleanRestValidations(this);

        this.catalogService
            .eliminarArticulo(this.articulo._id).then(articulo => {
                this.router.navigate(['/']);
            })
            .catch(error => errorHanlder.procesarValidacionesRestFormGroup(this, error));
    }
}
