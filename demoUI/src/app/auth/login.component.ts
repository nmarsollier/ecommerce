import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { AuthService, Usuario } from '../auth/auth.service';
import { IErrorController } from '../tools/error-handler';
import * as errorHanlder from '../tools/error-handler';

@Component({
    selector: 'app-auth-login',
    templateUrl: './login.component.html'
})
export class LoginComponent implements IErrorController {
    username: string;
    password: string;

    errorMessage: string;
    errors: string[] = [];

    constructor(private authService: AuthService, private router: Router) { }

    submitForm() {
        errorHanlder.cleanRestValidations(this);

        this.authService
            .login(this.username, this.password)
            .then(principal => {
                this.router.navigate(['/']);
            })
            .catch(error => errorHanlder.procesarValidacionesRest(this, error));
    }
}