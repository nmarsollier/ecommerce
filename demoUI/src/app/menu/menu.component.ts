import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { AuthService, Usuario } from '../auth/auth.service';
import * as errorHanlder from '../tools/error-handler';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements errorHanlder.IErrorController, OnInit {
  errorMessage: string;
  errors = new Map();

  ngOnInit(): void {
    if (localStorage.getItem('auth_token')) {
      this.authService.getPrincipal();
    }
  }

  get usuarioLogueado(): Usuario {
    return this.authService.usuarioLogueado;
  }

  constructor(private authService: AuthService, private router: Router) { }

  logout() {
    this.authService
      .logout()
      .then(_ => {
        this.router.navigate(['/']);
      })
      .catch(error => errorHanlder.procesarValidacionesRest(this, error));
  }
}
