import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Navbar } from '../navbar/navbar.component';
import { AuthMock } from '../../services/auth-mock';
import { Auth } from '../../interfaces/auth.interface';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, Navbar],
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  showBonus = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', Validators.required],
      category: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    const { fullName, email, phone, password, category } = this.registerForm.value;

    // Simula la registrazione
    this.auth.register({ fullName, email, phone, password, category }).subscribe({
      next: () => {
        if (category === 'student') this.showBonus = true;
        setTimeout(() => this.router.navigate(['/account']), 2000);
      },
      error: () => alert('Registration failed')
    });
  }
}
