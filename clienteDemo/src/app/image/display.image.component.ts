import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { AuthService, Usuario } from '../auth/auth.service';
import { IErrorController } from '../tools/error.handler';
import * as errorHanlder from '../tools/error.handler';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Image, ImageService, Calidad } from './image.service';

@Component({
    selector: 'app-show-image',
    templateUrl: './display.image.component.html',
    styleUrls: ['./display.image.component.css']
})
export class ShowImageComponent  {
    @Input()
    calidad: Calidad;

    @Input()
    set imagenId(name: string) {
        this.buscarImagen(name);
    }

    imagen: Image = { image: '' };

    constructor(private imageService: ImageService, private router: Router) { }

    buscarImagen(imagen: string) {
        if (imagen) {
            this.imageService
                .buscarImagen(imagen, this.calidad)
                .then(image => {
                    this.imagen = image;
                })
                .catch(error => {
                    this.imagen = { image: '/assets/not_found.png' };
                });
        } else {
            this.imagen = { image: '' };
        }
    }
}


