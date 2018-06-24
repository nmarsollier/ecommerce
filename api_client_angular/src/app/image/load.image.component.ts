import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as errorHandler from '../tools/error.handler';
import { ImageService } from './image.service';

@Component({
    selector: 'app-add-image',
    templateUrl: './load.image.component.html',
    styleUrls: ['./load.image.component.css']
})
export class LoadImageComponent implements errorHandler.IErrorController, OnInit {
    errorMessage: string;
    errors = new Map();
    imageId = new FormControl('45e25880-6997-11e8-b116-85b2a1414267', [Validators.required]);

    imageFounded: string;

    constructor(private imageService: ImageService, private router: Router, private route: ActivatedRoute) { }

    submitForm() {
        this.imageFounded = this.imageId.value;
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.imageId.setValue(params['id']);
            this.submitForm();
        });
    }
}


