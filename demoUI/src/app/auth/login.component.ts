import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { AuthService, Usuario } from '../auth/auth.service';
import { IErrorController } from '../tools/error-handler';
import * as errorHanlder from '../tools/error-handler';
import { FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-auth-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements errorHanlder.IFormGroupErrorController {
    form = new FormGroup({
        login: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required]),
    });

    errorMessage: string;
    errors = new Map();

    constructor(private authService: AuthService, private router: Router) { }

    submitForm() {
        errorHanlder.cleanRestValidations(this);

        this.authService
            .login(this.form.get('login').value, this.form.get('password').value)
            .then(principal => {
                this.router.navigate(['/']);
            })
            .catch(error => errorHanlder.procesarValidacionesRestFormGroup(this, error));
    }
}
