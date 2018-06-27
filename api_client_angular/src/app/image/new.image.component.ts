import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Image, ImageService } from './image.service';
import { BasicFromGroupController } from '../tools/error.form';

@Component({
    selector: 'app-new-image',
    templateUrl: './new.image.component.html'
})
export class AddImageComponent  extends BasicFromGroupController {
    showing = '/assets/select_image.png';
    image: Image = { image: '' };

    constructor(private imageService: ImageService, private router: Router) {
        super();
     }

    updateImage(image: any) {
        this.showing = image;
        this.image.image = image;
    }

    submitForm() {
        this.cleanRestValidations();

        if (this.image.image && !this.image.id) {
            this.imageService
                .saveImage(this.image)
                .then(image => {
                    this.image = image;
                })
                .catch(error => {
                    this.processRestValidations(error);
                });
        }
    }
}


