import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class RegisterComponent {
  form = { prenom: '', nom: '', email: '', mdp: '', category: 'regular' as 'student'|'regular' };

  constructor(private userS: UserService, private router: Router) {}

  public register() {
    this.userS.register(this.form.prenom, this.form.nom, this.form.email, this.form.mdp, this.form.category)
      .subscribe(() => {
        alert('Compte créé ! Connectez-vous.');
        this.router.navigate(['/login']);
      });
  }
  }
