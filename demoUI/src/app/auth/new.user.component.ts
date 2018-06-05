import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { AuthService, Usuario, RegistrarUsuario } from '../auth/auth.service';
import { IErrorController } from '../tools/error-handler';
import * as errorHanlder from '../tools/error-handler';

@Component({
    selector: 'app-auth-new-user',
    templateUrl: './new.user.component.html'
})
export class NewUserComponent implements IErrorController {
    user: RegistrarUsuario = {
        name: '',
        login: '',
        password: ''
    };

    errorMessage: string;
    errors: string[] = [];

    constructor(private authService: AuthService, private router: Router) { }

    submitForm() {
        errorHanlder.cleanRestValidations(this);

        this.authService
            .registrarUsuario(this.user)
            .then(principal => {
                this.router.navigate(['/']);
            })
            .catch(error => errorHanlder.procesarValidacionesRest(this, error));
    }
}