import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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

import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MAT_LABEL_GLOBAL_OPTIONS } from '@angular/material/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


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
    ReactiveFormsModule,
    HttpModule,
    MatInputModule,
    MatMenuModule,
    MatButtonModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    MatSidenavModule,
    MatListModule,
    routing
  ],
  providers: [AuthService, LoggedIn],
  bootstrap: [AppComponent]
})
export class AppModule { }
