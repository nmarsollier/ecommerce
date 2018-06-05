import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routing, LoggedIn } from './app.routes';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { AuthService } from './auth/auth.service';
import { LoginComponent } from './auth/login.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { InfoComponent } from './auth/info.component';
import { NewUserComponent } from './auth/new.user.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    LoginComponent,
    NewUserComponent,
    WelcomeComponent,
    InfoComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [AuthService, LoggedIn],
  bootstrap: [AppComponent]
})
export class AppModule { }
