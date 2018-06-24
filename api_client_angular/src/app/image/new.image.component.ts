import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as errorHandler from '../tools/error.handler';
import { Image, ImageService } from './image.service';

@Component({
    selector: 'app-new-image',
    templateUrl: './new.image.component.html'
})
export class AddImageComponent implements errorHandler.IErrorController {
    errorMessage: string;
    errors = new Map();
    showing = '/assets/select_image.png';
    image: Image = { image: '' };

    constructor(private imageService: ImageService, private router: Router) { }

    updateImage(image: any) {
        this.showing = image;
        this.image.image = image;
    }

    submitForm() {
        errorHandler.cleanRestValidations(this);

        if (this.image.image && !this.image.id) {
            this.imageService
                .saveImage(this.image)
                .then(image => {
                    this.image = image;
                })
                .catch(error => {
                    errorHandler.processRestValidations(this, error);
                });
        }
    }
}


