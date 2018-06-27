import { Injectable, ModuleWithProviders } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterModule, RouterStateSnapshot, Routes } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { InfoComponent } from './auth/info.component';
import { LoginComponent } from './auth/login.component';
import { NewUserComponent } from './auth/new.user.component';
import { AddArticleCartComponent } from './cart/add.article.cart.component';
import { CurrentCartComponent } from './cart/current.cart.component';
import { EditArticleComponent } from './catalog/edit.article.component';
import { SearchArticleComponent } from './catalog/search.articles.component';
import { LoadImageComponent } from './image/load.image.component';
import { AddImageComponent } from './image/new.image.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { NewPasswordComponent } from './auth/new.password.component';
import { UsersComponent } from './auth/users.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderDetailComponent } from './orders/order.detail.component';


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
    { path: 'password', component: NewPasswordComponent, canActivate: [LoggedIn] },
    { path: 'registrarse', component: NewUserComponent },
    { path: 'new_image', component: AddImageComponent, canActivate: [LoggedIn] },
    { path: 'load_image/:id', component: LoadImageComponent, canActivate: [LoggedIn] },
    { path: 'load_image', component: LoadImageComponent, canActivate: [LoggedIn] },
    { path: 'list_articles', component: SearchArticleComponent, canActivate: [LoggedIn] },
    { path: 'edit_article/:id', component: EditArticleComponent, canActivate: [LoggedIn] },
    { path: 'edit_article', component: EditArticleComponent, canActivate: [LoggedIn] },
    { path: 'current_cart', component: CurrentCartComponent, canActivate: [LoggedIn] },
    { path: 'add_article_cart', component: AddArticleCartComponent, canActivate: [LoggedIn] },
    { path: 'users', component: UsersComponent, canActivate: [LoggedIn] },
    { path: 'orders', component: OrdersComponent, canActivate: [LoggedIn] },
    { path: 'order_details/:id', component: OrderDetailComponent, canActivate: [LoggedIn] },
    { path: 'order_details', component: OrderDetailComponent, canActivate: [LoggedIn] },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
