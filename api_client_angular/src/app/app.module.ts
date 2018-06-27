import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoggedIn, routing } from './app.routes';
import { AuthService } from './auth/auth.service';
import { InfoComponent } from './auth/info.component';
import { LoginComponent } from './auth/login.component';
import { NewPasswordComponent } from './auth/new.password.component';
import { NewUserComponent } from './auth/new.user.component';
import { UsersComponent } from './auth/users.component';
import { AddArticleCartComponent } from './cart/add.article.cart.component';
import { CartService } from './cart/cart.service';
import { CurrentCartComponent } from './cart/current.cart.component';
import { CatalogService } from './catalog/catalog.service';
import { EditArticleComponent } from './catalog/edit.article.component';
import { SearchArticleComponent } from './catalog/search.articles.component';
import { ShowImageComponent } from './image/display.image.component';
import { ImageService } from './image/image.service';
import { LoadImageComponent } from './image/load.image.component';
import { AddImageComponent } from './image/new.image.component';
import { MenuComponent } from './menu/menu.component';
import { OrderDetailComponent } from './orders/order.detail.component';
import { OrderService } from './orders/order.service';
import { OrdersComponent } from './orders/orders.component';
import { AppComponent } from './root.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { FileUploadComponent } from './tools/file.upload.component';
import { WelcomeComponent } from './welcome/welcome.component';



@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    ToolbarComponent,
    LoginComponent,
    NewUserComponent,
    WelcomeComponent,
    AddImageComponent,
    FileUploadComponent,
    LoadImageComponent,
    InfoComponent,
    SearchArticleComponent,
    ShowImageComponent,
    EditArticleComponent,
    CurrentCartComponent,
    AddArticleCartComponent,
    NewPasswordComponent,
    UsersComponent,
    OrdersComponent,
    OrderDetailComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    routing,
    NgbModule.forRoot()
  ],
  providers: [AuthService, ImageService, LoggedIn, CatalogService, CartService, OrderService],
  bootstrap: [AppComponent]
})
export class AppModule { }
