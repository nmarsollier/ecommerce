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

    imagenBuscada: string;

    constructor(private imageService: ImageService, private router: Router) { }

    submitForm() {
        this.imagenBuscada = this.imagenId.value;
    }
}


