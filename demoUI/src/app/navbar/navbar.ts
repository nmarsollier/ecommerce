import {Component, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule, MatMenuModule, MatIconModule} from '@angular/material';
import {RouterModule} from '@angular/router';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class NavBarComponent {

}

@NgModule({
  imports: [
    MatButtonModule,
    MatMenuModule,
    RouterModule,
    MatIconModule,
    CommonModule
  ],
  exports: [NavBarComponent],
  declarations: [NavBarComponent],
})
export class NavBarModule {}
