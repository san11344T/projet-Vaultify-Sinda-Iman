import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
})
export class Navbar implements OnInit {
  mobileMenuOpen = false;
  isLoggedIn = false;
  currentUser: User | null = null;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Controlla se l'utente è loggato

    this.currentUser = this.auth.getCurrentUser();
    this.isLoggedIn = !!this.currentUser;
  }

  logout() {
    if (confirm('Are you sure you want to logout?')) {
      this.auth.logout();
      this.isLoggedIn = false;
      this.currentUser = null;
      this.router.navigate(['/']);
    }
  }
}
