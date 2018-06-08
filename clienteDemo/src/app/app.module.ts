import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { routing, LoggedIn } from './app.routes';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material';
import { MatTableModule } from '@angular/material/table';

import { AppComponent } from './root.component';
import { MenuComponent } from './menu/menu.component';
import { AuthService } from './auth/auth.service';
import { LoginComponent } from './auth/login.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { InfoComponent } from './auth/info.component';
import { NewUserComponent } from './auth/new.user.component';
import { FileUploadComponent } from './tools/file.upload.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { AddImageComponent } from './image/new.image.component';
import { ImageService } from './image/image.service';
import { LoadImageComponent } from './image/load.image.component';
import { NewArticleComponent } from './catalog/new.article.component';
import { CatalogService } from './catalog/catalog.service';
import { SearchArticleComponent } from './catalog/search.articles.component';
import { ShowImageComponent } from './image/display.image.component';
import { EditArticleComponent } from './catalog/edit.article.component';
import { MatFileUploadComponent } from './tools/mat.file.upload.component';
import { CurrentCartComponent } from './cart/current.cart.component';
import { CartService } from './cart/cart.service';
import { AddArticleCartComponent } from './cart/add.article.cart.component';


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
    NewArticleComponent,
    SearchArticleComponent,
    ShowImageComponent,
    EditArticleComponent,
    MatFileUploadComponent,
    CurrentCartComponent,
    AddArticleCartComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    MatInputModule,
    MatTableModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    MatSidenavModule,
    MatListModule,
    routing
  ],
  providers: [AuthService, ImageService, LoggedIn, CatalogService, CartService],
  bootstrap: [AppComponent]
})
export class AppModule { }
