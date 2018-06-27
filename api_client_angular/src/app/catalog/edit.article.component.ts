import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Calidad, ImageService } from '../image/image.service';
import { Article, CatalogService } from './catalog.service';
import { BasicFromGroupController } from '../tools/error.form';

@Component({
    selector: 'app-catalog-edit-article',
    templateUrl: './edit.article.component.html'
})
export class EditArticleComponent extends BasicFromGroupController implements OnInit {
    articleId = new FormControl('', [Validators.required]);
    articulo: Article;
    nuevaImagen: string;

    form = new FormGroup({
        name: new FormControl('', [Validators.required]),
        description: new FormControl(''),
        image: new FormControl('/assets/select_image.png'),
        price: new FormControl('0'),
        stock: new FormControl('0'),
    });

    constructor(private catalogService: CatalogService, private imageService: ImageService,
        private router: Router, private route: ActivatedRoute) {
        super();
    }

    buscar() {
        this.cleanRestValidations();

        this.catalogService
            .getArticle(this.articleId.value)
            .then(articulo => {
                this.articulo = articulo;
                this.form.get('name').setValue(articulo.name);
                this.form.get('description').setValue(articulo.description);
                this.form.get('price').setValue(articulo.price);
                this.form.get('stock').setValue(articulo.stock);

                if (articulo.image) {
                    this.imageService.getImage(this.articulo.image, Calidad.Q160)
                        .then(
                            imagen => {
                                this.form.get('image').setValue(imagen.image);
                            }
                        )
                        .catch(error => this.form.get('image').setValue('/assets/not_found.png'));
                }
            })
            .catch(error => this.processRestValidations(error));
    }


    updateImage(imagen: string) {
        this.nuevaImagen = imagen;
        this.form.get('image').setValue(imagen);
    }

    submitForm() {
        this.cleanRestValidations();

        if (this.nuevaImagen) {
            this.imageService.saveImage({ image: this.nuevaImagen }).then(
                imagen => {
                    this.articulo.image = imagen.id;

                    this.uploadArticle();
                })
                .catch(error => this.processRestValidations(error));
        } else {
            this.uploadArticle();
        }
    }


    uploadArticle() {
        if (this.articulo._id) {
            this.catalogService
                .updateArticle(this.articulo._id, {
                    name: this.form.get('name').value,
                    description: this.form.get('description').value,
                    image: this.articulo.image,
                    price: Number(this.form.get('price').value),
                    stock: Number(this.form.get('stock').value)
                }).then(articulo => {
                    this.router.navigate(['/']);
                })
                .catch(error => this.processRestValidations(error));
        } else {
            this.catalogService
                .newArticle({
                    name: this.form.get('name').value,
                    description: this.form.get('description').value,
                    image: this.articulo.image,
                    price: Number(this.form.get('price').value),
                    stock: Number(this.form.get('stock').value)
                }).then(articulo => {
                    this.router.navigate(['/']);
                })
                .catch(error => this.processRestValidations(error));
        }
    }


    eliminar() {
        this.cleanRestValidations();

        this.catalogService
            .deleteArticle(this.articulo._id).then(articulo => {
                this.router.navigate(['/']);
            })
            .catch(error => this.processRestValidations(error));
    }


    ngOnInit() {
        this.route.params.subscribe(params => {
            const _id = params['id'];
            if (_id === 'new') {
                this.articulo = {
                    name: '',
                    description: ''
                };
            } else {
                this.articleId.setValue(_id);
                this.buscar();
            }
        });
    }
}
