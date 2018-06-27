import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from './auth.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { BasicFromGroupController } from '../tools/error.form';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html'
})
export class UsersComponent extends BasicFromGroupController implements OnInit {
    users: User[];

    editPermisos: User;

    form = new FormGroup({
        permisos: new FormControl('', [Validators.required]),
    });

    constructor(private authService: AuthService, private router: Router) {
        super();
    }

    ngOnInit(): void {
        this.getUsers();
    }

    editarPermisos(user: User) {
        this.form.get('permisos').setValue('');
        this.editPermisos = user;
    }
    cancelarPermisos() {
        this.editPermisos = undefined;
    }
    grantPermisos() {
        this.authService.grant(this.editPermisos.id, this.form.get('permisos').value.split(','))
            .then(
                result => this.getUsers()
            ).catch(err => this.processRestValidations(err));
    }
    revokePermisos() {
        this.authService.revoke(this.editPermisos.id, this.form.get('permisos').value.split(','))
            .then(
                result => this.getUsers()
            ).catch(err => this.processRestValidations(err));
    }
    enableUser(id: string) {
        this.authService.enable(id).then(
            result => this.getUsers()
        ).catch(err => this.processRestValidations(err));
    }

    disableUser(id: string) {
        this.authService.disable(id).then(
            result => this.getUsers()
        ).catch(err => this.processRestValidations(err));
    }

    getUsers() {
        this.authService.getUsers().then(
            result => this.users = result
        ).catch(err => this.processRestValidations(err));
    }
}
