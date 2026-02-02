import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Navbar } from "../navbar/navbar.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ 
    RouterModule,Navbar],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

}
