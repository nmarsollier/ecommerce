import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import * as errorHandler from '../tools/error.handler';

@Component({
    selector: 'app-auth-new-user',
    templateUrl: './new.user.component.html'
})
export class NewUserComponent implements errorHandler.IFormGroupErrorController {
    errorMessage: string;
    errors = new Map();

    form = new FormGroup({
        login: new FormControl('', [Validators.required]),
        name: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required]),
    });

    constructor(private authService: AuthService, private router: Router) { }

    submitForm() {
        errorHandler.cleanRestValidations(this);

        this.authService
            .newUser({
                name: this.form.get('name').value,
                login: this.form.get('login').value,
                password: this.form.get('password').value
            }).then(principal => {
                this.router.navigate(['/']);
            })
            .catch(error => errorHandler.processFormGroupRestValidations(this, error));
    }
}
