import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../auth/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html'
})
export class MenuComponent implements OnInit {
  ngOnInit(): void {
    if (localStorage.getItem('auth_token')) {
      this.authService.getPrincipal();
    }
  }

  get usuarioLogueado(): User {
    return this.authService.usuarioLogueado;
  }

  constructor(private authService: AuthService, private router: Router) { }

  logout() {
    this.authService
      .logout()
      .then(_ => {
        this.router.navigate(['/']);
      })
      .catch(error => {});
  }
}
