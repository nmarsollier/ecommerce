import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BasicFromGroupController } from '../tools/error.form';
import { ImageService } from './image.service';

@Component({
    selector: 'app-add-image',
    templateUrl: './load.image.component.html',
    styleUrls: ['./load.image.component.css']
})
export class LoadImageComponent  extends BasicFromGroupController implements OnInit {

    form = new FormGroup({
        imageId: new FormControl('45e25880-6997-11e8-b116-85b2a1414267', [Validators.required]),
    });

    imageFounded: string;

    constructor(private imageService: ImageService, private router: Router, private route: ActivatedRoute) {
        super();
     }

    submitForm() {
        this.imageFounded = this.form.get('imageId').value;
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.form.get('imageId').setValue(params['id']);
            this.submitForm();
        });
    }
}


