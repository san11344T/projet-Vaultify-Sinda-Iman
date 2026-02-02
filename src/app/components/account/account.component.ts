import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AccountService } from '../../services/account.service';
import { TransferService } from '../../services/transfer.service';
import { AdvisorService } from '../../services/advisor.service';
import { User } from '../../interfaces/user.interface';
import { Account } from '../../interfaces/account.interface';
import { Transfer } from '../../interfaces/transfer.interface';
import { Navbar } from "../navbar/navbar.component";

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [Navbar,CommonModule, FormsModule, RouterModule],
  templateUrl: './account.html',
  styleUrl: './account.scss',
})
export class AccountComponent implements OnInit {
  user!: User;
  account!: Account;
  history: Transfer[] = [];

  // Variabili transfer
  transferAmount = 0;
  transferRecipient = '';
  transferDescription = '';
  transferError = false;

  constructor(
    private auth: AuthService,
    private accountS: AccountService,
    private transferS: TransferService,
    private advisorS: AdvisorService,
    private router: Router
  ) {}

  ngOnInit() {
    const local = this.auth.getCurrentUser();
    if (!local) { 
      this.router.navigate(['/login']); 
      return; 
    }
    this.user = local;

    this.accountS.getAccountByUserId(local.id).subscribe(acc => this.account = acc);
    this.transferS.getHistory(local.id).subscribe(h => this.history = h);
  }

  onTransfer() {
    if (!this.user || !this.transferAmount || !this.transferRecipient) {
      this.transferError = true;
      return;
    }

    if (this.account.balance < this.transferAmount) {
      this.transferError = true;
      setTimeout(() => {
        alert("Your balance isn't enough to complete this transfer. Please check your account.");
      }, 100);
      return;
    }

    this.transferError = false;

    this.transferS.executeTransfer(this.user.id, this.transferRecipient, this.transferAmount).subscribe({
      next: () => {
        alert('Transfer completed successfully!');
        this.refreshHistory(); // ← Refresh automatico
        // Reset form
        this.transferAmount = 0;
        this.transferRecipient = '';
        this.transferDescription = '';
      },
      error: (err) => {
        console.error('Transfer error:', err);
        alert('Transfer failed. Please check recipient details.');
      }
    });
  }

  refreshHistory() {
    if (this.user) {
      this.transferS.getHistory(this.user.id).subscribe(h => this.history = h);
    }
  }

  // ← METODI PER TEMPLATE (fix errori compilazione)
  getTotalBonuses(): number {
    return this.user.offers ? 
      this.user.offers.reduce((sum: number, o: any) => sum + (o.amount || 0), 0) : 0;
  }

  getOffersCount(): number {
    return this.user.offers ? this.user.offers.length : 0;
  }

  // ← METODI PER HISTORY (basati su fromUserId invece di 'type')
  isIncome(t: Transfer): boolean {
    return t.fromUserId !== this.user.id; // Entrata = da altro utente
  }

  isExpense(t: Transfer): boolean {
    return t.fromUserId === this.user.id; // Uscita = da questo utente
  }

  getTransactionClasses(t: Transfer): { [key: string]: boolean } {
    if (this.isIncome(t)) {
      return { 
        'bg-emerald-50/80': true, 
        'border-emerald-200': true, 
        'hover:bg-emerald-100': true 
      };
    }
    if (this.isExpense(t)) {
      return { 
        'bg-slate-50/80': true, 
        'border-slate-200': true, 
        'hover:bg-slate-100': true 
      };
    }
    return { 
      'bg-gray-50/80': true, 
      'border-gray-200': true, 
      'hover:bg-gray-100': true 
    };
  }

  getTransactionIconClass(t: Transfer): { [key: string]: boolean } {
    if (this.isIncome(t)) return { 'bg-emerald-500': true };
    if (this.isExpense(t)) return { 'bg-slate-500': true };
    return { 'bg-gray-500': true };
  }

  getTransactionAmountClass(t: Transfer): { [key: string]: boolean } {
    if (this.isIncome(t)) return { 'text-emerald-600': true };
    if (this.isExpense(t)) return { 'text-slate-700': true };
    return { 'text-gray-600': true };
  }

  getTransactionAmount(t: Transfer): string {
    return (t.fromUserId === this.user.id ? '-' : '+') + t.amount.toFixed(2) + '€';
  }

  // ← BONUS: Logout con conferma
  logout() {
    if (confirm('Are you sure you want to logout?')) {
      this.auth.logout();
      this.router.navigate(['/login']);
    }
  }

  // Création de demande (mantenuto)
  createRequest(type: 'LIVRET_A' | 'CLOSURE' | 'INSURANCE') {
    if (!this.user) return;

    const messages = {
      'LIVRET_A': 'Ouvrir un Livret A',
      'CLOSURE': 'Clôturer le compte',
      'INSURANCE': 'Souscrire une assurance'
    };

    if(confirm(`Confirmez-vous la demande de ${messages[type]} ?`)) {
      this.advisorS.createRequest(this.user.id, type).subscribe({
        next: () => alert('Demande envoyée au conseiller!'),
        error: () => alert('Erreur lors de l\'envoi.')
      });
    }
  }
}
