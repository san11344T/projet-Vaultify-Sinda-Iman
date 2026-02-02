import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Navbar } from "../navbar/navbar.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, Navbar],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})

export class LoginComponent {
  loginForm: FormGroup;
  recoveryForm: FormGroup;

  showRecovery = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    // Form principale
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // Form di recovery
    this.recoveryForm = this.fb.group({
      recoveryEmail: ['', [Validators.required, Validators.email]]
    });
  }

  // Login
  onSubmit() {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;
    this.auth.login(email, password).subscribe({
      next: () => this.router.navigate(['/account']),
      error: () => alert('Login failed'),
    });
  }

  // Password recovery
  onRecovery() {
    if (this.recoveryForm.invalid) return;

    const { recoveryEmail } = this.recoveryForm.value;
    // this.auth.recoverPassword(recoveryEmail).subscribe({
    //   next: () => {
    //     alert('Recovery email sent!');
    //     this.showRecovery = false;
    //   },
    //   error: () => alert('Failed to send recovery ema
  }
}