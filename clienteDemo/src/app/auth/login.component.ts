import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import * as errorHandler from '../tools/error.handler';

@Component({
    selector: 'app-auth-login',
    templateUrl: './login.component.html'
})
export class LoginComponent implements errorHandler.IFormGroupErrorController {
    form = new FormGroup({
        login: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required]),
    });

    errorMessage: string;
    errors = new Map();

    constructor(private authService: AuthService, private router: Router) { }

    submitForm() {
        errorHandler.cleanRestValidations(this);

        this.authService
            .login(this.form.get('login').value, this.form.get('password').value)
            .then(principal => {
                this.router.navigate(['/']);
            })
            .catch(error => errorHandler.processFormGroupRestValidations(this, error));
    }
}
