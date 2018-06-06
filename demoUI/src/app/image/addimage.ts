import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { AuthService, Usuario } from '../auth/auth.service';
import { IErrorController } from '../tools/error-handler';
import * as errorHanlder from '../tools/error-handler';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Image, ImageService } from './image.service';

@Component({
    selector: 'app-add-image',
    templateUrl: './addimage.html'
})
export class AddImageComponent implements errorHanlder.IErrorController {
    errorMessage: string;
    errors = new Map();
    showing = '/assets/select_image.png';
    imagen: Image = { image: '' };

    constructor(private imageService: ImageService, private router: Router) { }

    actualizarImagen(imagen: any) {
        this.showing = imagen;
        this.imagen.image = imagen;
    }

    submitForm() {
        errorHanlder.cleanRestValidations(this);

        if (this.imagen.image && !this.imagen.id) {
            this.imageService
                .guardarImagen(this.imagen)
                .then(image => {
                    this.imagen = image;
                })
                .catch(error => {
                    errorHanlder.procesarValidacionesRest(this, error)
                });
        }
    }
}


