import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import * as errorHandler from '../tools/error.handler';

@Component({
    selector: 'app-auth-new-password',
    templateUrl: './new.password.component.html'
})
export class NewPasswordComponent implements errorHandler.IFormGroupErrorController {
    errorMessage: string;
    errors = new Map();

    form = new FormGroup({
        login: new FormControl('', [Validators.required]),
        currentPassword: new FormControl('', [Validators.required]),
        newPassword: new FormControl('', [Validators.required]),
        newPassword1: new FormControl('', [Validators.required]),
    }, (formGroup: FormGroup) => {
        return this.validarPasswords(formGroup);
    });

    constructor(private authService: AuthService, private router: Router) {
        this.form.get('login').setValue(authService.usuarioLogueado.login);
    }

    validarPasswords(group: FormGroup) {
        if (group.controls.newPassword1.dirty && group.controls.newPassword.value !== group.controls.newPassword1.value) {
            errorHandler.processFormGroupRestValidations(this, {
                messages: [
                    {
                        path: 'newPassword1',
                        message: 'Los passwords no son iguales',
                    }
                ]
            });
            return this.errors.values;
        } else {
            errorHandler.cleanRestValidations(this);
        }
        // tslint:disable-next-line:no-null-keyword
        return null;
    }

    submitForm() {
        errorHandler.cleanRestValidations(this);

        this.authService
            .changePassword(
                this.form.get('currentPassword').value,
                this.form.get('newPassword').value
            ).then(principal => {
                this.router.navigate(['/']);
            })
            .catch(error => errorHandler.processFormGroupRestValidations(this, error));
    }
}
