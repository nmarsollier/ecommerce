import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as errorHandler from '../tools/error.handler';
import { AuthService, User } from './auth.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html'
})
export class UsersComponent implements errorHandler.IErrorController, OnInit {

    errorMessage: string;
    errors = new Map();

    users: User[];

    editPermisos: string;
    permisos = new FormControl('', [Validators.required]);

    constructor(private authService: AuthService, private router: Router) { }

    ngOnInit(): void {
        this.getUsers();
    }

    editarPermisos(id: string) {
        this.permisos.setValue('');
        this.editPermisos = id;
    }
    cancelarPermisos() {
        this.editPermisos = undefined;
    }
    grantPermisos() {
        this.authService.grant(this.editPermisos, this.permisos.value.split(','))
            .then(
                result => this.getUsers()
            ).catch(err => errorHandler.processRestValidations(this, err));
    }
    revokePermisos() {
        this.authService.revoke(this.editPermisos, this.permisos.value.split(','))
            .then(
                result => this.getUsers()
            ).catch(err => errorHandler.processRestValidations(this, err));
    }
    enableUser(id: string) {
        this.authService.enable(id).then(
            result => this.getUsers()
        ).catch(err => errorHandler.processRestValidations(this, err));
    }

    disableUser(id: string) {
        this.authService.disable(id).then(
            result => this.getUsers()
        ).catch(err => errorHandler.processRestValidations(this, err));
    }

    getUsers() {
        this.authService.getUsers().then(
            result => this.users = result
        ).catch(err => errorHandler.processRestValidations(this, err));
    }
}
