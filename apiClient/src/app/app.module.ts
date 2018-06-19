import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MatIconModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LoggedIn, routing } from './app.routes';
import { AuthService } from './auth/auth.service';
import { InfoComponent } from './auth/info.component';
import { LoginComponent } from './auth/login.component';
import { NewUserComponent } from './auth/new.user.component';
import { AddArticleCartComponent } from './cart/add.article.cart.component';
import { CartService } from './cart/cart.service';
import { CurrentCartComponent } from './cart/current.cart.component';
import { CatalogService } from './catalog/catalog.service';
import { EditArticleComponent } from './catalog/edit.article.component';
import { NewArticleComponent } from './catalog/new.article.component';
import { SearchArticleComponent } from './catalog/search.articles.component';
import { ShowImageComponent } from './image/display.image.component';
import { ImageService } from './image/image.service';
import { LoadImageComponent } from './image/load.image.component';
import { AddImageComponent } from './image/new.image.component';
import { MenuComponent } from './menu/menu.component';
import { AppComponent } from './root.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { FileUploadComponent } from './tools/file.upload.component';
import { MatFileUploadComponent } from './tools/mat.file.upload.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { NewPasswordComponent } from './auth/new.password.component';
import { UsersComponent } from './auth/users.component';



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
    AddArticleCartComponent,
    NewPasswordComponent,
    UsersComponent,
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
