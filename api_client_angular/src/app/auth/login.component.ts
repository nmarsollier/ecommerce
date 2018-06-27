import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { BasicFromGroupController } from '../tools/error.form';

@Component({
    selector: 'app-auth-login',
    templateUrl: './login.component.html'
})
export class LoginComponent extends BasicFromGroupController {
    form = new FormGroup({
        login: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required]),
    });

    constructor(private authService: AuthService, private router: Router) {
        super();
     }

    submitForm() {
        this.cleanRestValidations();

        this.authService
            .login(this.form.get('login').value, this.form.get('password').value)
            .then(principal => {
                this.router.navigate(['/']);
            })
            .catch(error => this.processRestValidations(error));
    }
}
