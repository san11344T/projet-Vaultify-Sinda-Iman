// settings.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AdvisorService } from '../../services/advisor.service';
import { User } from '../../interfaces/user.interface';
import { Navbar } from "../navbar/navbar.component";

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [Navbar,CommonModule, RouterModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss'
})
export class SettingsComponent implements OnInit {
  user!: User;

  constructor(
    private auth: AuthService,
    private advisorS: AdvisorService,
    private router: Router
  ) {}

  ngOnInit() {
    const currentUser = this.auth.getCurrentUser();
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    this.user = currentUser;
  }

  // ← THEME CHANGE HANDLER
  handleThemeChange(theme: string) {
    console.log(`Theme changed to: ${theme}`);
    alert(`Theme "${theme}" will be applied soon! (Feature coming)`);
    
    // TODO: Implementa logica per cambiare tema
    // Es: localStorage.setItem('theme', theme);
    // Poi applica classi CSS dinamiche
  }

  // ← DOCUMENT DOWNLOAD HANDLER
  handleDocumentDownload(docType: string) {
    if (!this.user) return;

    console.log(`Requesting ${docType} for user ${this.user.id}`);
    
    // Simula download o richiesta al backend
    if (confirm(`Do you want to request your ${docType}?`)) {
      alert(`Your ${docType} request has been sent! You'll receive it by email shortly.`);
      
      // TODO: Implementa chiamata al backend
      // this.documentService.requestDocument(this.user.id, docType).subscribe(...)
    }
  }

  // ← INSURANCE REQUEST HANDLER (usa AdvisorService esistente)
  handleInsuranceRequest(insuranceType: string) {
    if (!this.user) return;

    const message = `Do you want to request a quote for ${insuranceType} insurance?`;
    
    if (confirm(message)) {
      // Usa il tuo AdvisorService esistente
      this.advisorS.createRequest(this.user.id, 'INSURANCE').subscribe({
        next: () => {
          alert(`Your ${insuranceType} insurance request has been sent to your advisor!`);
        },
        error: () => {
          alert('Error sending insurance request. Please try again.');
        }
      });
    }
  }
}
