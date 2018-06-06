import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { AuthService, Usuario } from '../auth/auth.service';
import { IErrorController } from '../tools/error.handler';
import * as errorHanlder from '../tools/error.handler';

@Component({
    selector: 'app-auth-info',
    templateUrl: './info.component.html'
})
export class InfoComponent implements OnInit {
    token: string;

    get usuarioLogueado(): Usuario {
        return this.authService.usuarioLogueado;
    }

    ngOnInit(): void {
        this.token = 'bearer ' + localStorage.getItem('auth_token');
    }

    constructor(private authService: AuthService, private router: Router) { }
}
