import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { BasicFromGroupController } from '../tools/error.form';

@Component({
    selector: 'app-auth-new-password',
    templateUrl: './new.password.component.html'
})
export class NewPasswordComponent extends BasicFromGroupController {
    form = new FormGroup({
        login: new FormControl('', [Validators.required]),
        currentPassword: new FormControl('', [Validators.required]),
        newPassword: new FormControl('', [Validators.required]),
        newPassword1: new FormControl('', [Validators.required]),
    }, (formGroup: FormGroup) => {
        return this.validarPasswords(formGroup);
    });

    constructor(private authService: AuthService, private router: Router) {
        super();
        this.form.get('login').setValue(authService.usuarioLogueado.login);
    }

    validarPasswords(group: FormGroup) {
        if (group.controls.newPassword1.dirty && group.controls.newPassword.value !== group.controls.newPassword1.value) {
            this.processRestValidations({
                messages: [
                    {
                        path: 'newPassword1',
                        message: 'Los passwords no son iguales',
                    }
                ]
            });
            return this.errors.values;
        }
        // tslint:disable-next-line:no-null-keyword
        return null;
    }

    submitForm() {
        this.cleanRestValidations();

        this.authService
            .changePassword(
                this.form.get('currentPassword').value,
                this.form.get('newPassword').value
            ).then(principal => {
                this.router.navigate(['/']);
            })
            .catch(error => this.processRestValidations(error));
    }
}
