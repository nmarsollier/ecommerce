import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { AuthService, Usuario, RegistrarUsuario } from '../auth/auth.service';
import { IErrorController } from '../tools/error-handler';
import * as errorHanlder from '../tools/error-handler';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-auth-new-user',
    templateUrl: './new.user.component.html'
})
export class NewUserComponent implements errorHanlder.IFormGroupErrorController {
    errorMessage: string;
    errors = new Map();

    form = new FormGroup({
        login: new FormControl('', [Validators.required]),
        name: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required]),
    });

    constructor(private authService: AuthService, private router: Router) { }

    submitForm() {
        errorHanlder.cleanRestValidations(this);

        this.authService
            .registrarUsuario({
                name: this.form.get('name').value,
                login: this.form.get('login').value,
                password: this.form.get('password').value
            }).then(principal => {
                this.router.navigate(['/']);
            })
            .catch(error => errorHanlder.procesarValidacionesRestFormGroup(this, error));
    }
}
