import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Calidad, Image, ImageService } from './image.service';

@Component({
    selector: 'app-show-image',
    templateUrl: './display.image.component.html',
    styleUrls: ['./display.image.component.css']
})
export class ShowImageComponent  {
    @Input()
    quality: Calidad;

    @Input()
    jpeg: string;

    @Input()
    set imageId(name: string) {
        this.getImage(name);
    }

    image: Image = { image: '' };

    constructor(private imageService: ImageService, private router: Router) { }

    getImage(image: string) {
        if (image) {
            this.imageService
                .getImage(image, this.quality, Boolean(this.jpeg))
                .then(result => {
                    this.image = result;
                })
                .catch(error => {
                    this.image = { image: '/assets/not_found.png' };
                });
        } else {
            this.image = { image: '' };
        }
    }
}


