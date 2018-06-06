import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { AuthService, Usuario } from '../auth/auth.service';
import { IErrorController } from '../tools/error.handler';
import * as errorHanlder from '../tools/error.handler';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Image, ImageService, Calidad } from './image.service';

@Component({
    selector: 'app-add-image',
    templateUrl: './load.image.component.html',
    styleUrls: ['./load.image.component.css']
})
export class LoadImageComponent implements errorHanlder.IErrorController {
    errorMessage: string;
    errors = new Map();
    imagenId = new FormControl('45e25880-6997-11e8-b116-85b2a1414267', [Validators.required]);

    imagen160: Image = { image: '' };
    imagen320: Image = { image: '' };
    imagen640: Image = { image: '' };
    imagen800: Image = { image: '' };
    imagen1024: Image = { image: '' };
    imagen1200: Image = { image: '' };
    imagenOriginal: Image = { image: '' };

    constructor(private imageService: ImageService, private router: Router) { }

    submitForm() {
        errorHanlder.cleanRestValidations(this);

        this.imageService
            .buscarImagen(this.imagenId.value, Calidad.Q160)
            .then(image => {
                this.imagen160 = image;
            })
            .catch(error => {
                errorHanlder.procesarValidacionesRest(this, error);
            });

        this.imageService
            .buscarImagen(this.imagenId.value, Calidad.Q320)
            .then(image => {
                this.imagen320 = image;
            })
            .catch(error => {
                errorHanlder.procesarValidacionesRest(this, error);
            });

        this.imageService
            .buscarImagen(this.imagenId.value, Calidad.Q640)
            .then(image => {
                this.imagen640 = image;
            })
            .catch(error => {
                errorHanlder.procesarValidacionesRest(this, error);
            });

        this.imageService
            .buscarImagen(this.imagenId.value, Calidad.Q800)
            .then(image => {
                this.imagen800 = image;
            })
            .catch(error => {
                errorHanlder.procesarValidacionesRest(this, error);
            });

        this.imageService
            .buscarImagen(this.imagenId.value, Calidad.Q800)
            .then(image => {
                this.imagen800 = image;
            })
            .catch(error => {
                errorHanlder.procesarValidacionesRest(this, error);
            });

        this.imageService
            .buscarImagen(this.imagenId.value, Calidad.Q1024)
            .then(image => {
                this.imagen1024 = image;
            })
            .catch(error => {
                errorHanlder.procesarValidacionesRest(this, error);
            });

        this.imageService
            .buscarImagen(this.imagenId.value, Calidad.Q1200)
            .then(image => {
                this.imagen1200 = image;
            })
            .catch(error => {
                errorHanlder.procesarValidacionesRest(this, error);
            });

        this.imageService
            .buscarImagen(this.imagenId.value)
            .then(image => {
                this.imagenOriginal = image;
            })
            .catch(error => {
                errorHanlder.procesarValidacionesRest(this, error);
            });
    }
}


