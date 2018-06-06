import { ModuleWithProviders, Injectable } from '@angular/core';
import { Routes, RouterModule, CanLoad, Route, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { LoginComponent } from './auth/login.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { InfoComponent } from './auth/info.component';
import { NewUserComponent } from './auth/new.user.component';
import { AuthService } from './auth/auth.service';
import { AddImageComponent } from './image/new.image.component';
import { LoadImageComponent } from './image/load.image.component';
import { NewArticleComponent } from './catalog/new.article.component';
import { SearchArticleaComponent } from './catalog/search.articles.component';


@Injectable()
export class LoggedIn implements CanActivate {
    constructor(private router: Router, private auth: AuthService) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        if (this.auth.usuarioLogueado) {
            return true;
        } else {
            this.router.navigate(['/']);
            return false;
        }
    }
}

// Route Configuration
export const routes: Routes = [
    { path: '', component: WelcomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'info', component: InfoComponent, canActivate: [LoggedIn] },
    { path: 'registrarse', component: NewUserComponent },
    { path: 'new_image', component: AddImageComponent, canActivate: [LoggedIn] },
    { path: 'load_image', component: LoadImageComponent, canActivate: [LoggedIn] },
    { path: 'new_article', component: NewArticleComponent, canActivate: [LoggedIn] },
    { path: 'list_articles', component: SearchArticleaComponent, canActivate: [LoggedIn] },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);