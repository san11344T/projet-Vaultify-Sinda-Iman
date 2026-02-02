// history.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TransferService } from '../../services/transfer.service';
import { Transfer } from '../../interfaces/transfer.interface';
import { User } from '../../interfaces/user.interface';
import { Navbar } from "../navbar/navbar.component";

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [Navbar,CommonModule, RouterModule ],
  templateUrl: './history.html',
  styleUrl: './history.scss'
})
export class History implements OnInit {
  history: Transfer[] = [];
  user!: User;

  constructor(
    private auth: AuthService,
    private transferS: TransferService,
    private router: Router
  ) {}

  ngOnInit() {
    const currentUser = this.auth.getCurrentUser();
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    this.user = currentUser;

    // Load history
    this.transferS.getHistory(currentUser.id).subscribe(h => {
      this.history = h.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    });
  }

  // ← METODI PER CLASSIFICARE TRANSAZIONI (basati su fromUserId)
  isIncome(t: Transfer): boolean {
    return t.fromUserId !== this.user.id;
  }

  isExpense(t: Transfer): boolean {
    return t.fromUserId === this.user.id;
  }

  isBonus(t: Transfer): boolean {
    // Bonus = income con label che contiene "bonus" o "offer"
    return this.isIncome(t) && 
           (t.label.toLowerCase().includes('bonus') || 
            t.label.toLowerCase().includes('offer') ||
            t.label.toLowerCase().includes('student'));
  }

  isError(t: Transfer): boolean {
    // Error detection logic (se hai un campo status o simile)
    return false; // Adatta alla tua logica
  }

  // ← CLASSI TAILWIND DINAMICHE
  getTransactionClasses(t: Transfer): { [key: string]: boolean } {
    if (this.isBonus(t)) {
      return {
        'bg-gradient-to-r': true,
        'from-[#D5A928]/5': true,
        'to-[#D5A928]/10': true,
        'border-[#D5A928]/30': true,
        'hover:border-[#D5A928]': true,
        'hover:from-[#D5A928]/10': true,
        'hover:to-[#D5A928]/15': true
      };
    }
    if (this.isIncome(t)) {
      return {
        'bg-[#3ACFD9]/5': true,
        'border-[#3ACFD9]/30': true,
        'hover:bg-[#3ACFD9]/10': true,
        'hover:border-[#3ACFD9]': true
      };
    }
    if (this.isExpense(t)) {
      return {
        'bg-[#1F2937]/5': true,
        'border-[#1F2937]/20': true,
        'hover:bg-[#1F2937]/10': true
      };
    }
    if (this.isError(t)) {
      return {
        'bg-red-50': true,
        'border-red-200': true,
        'hover:bg-red-100': true
      };
    }
    return { 'bg-white': true, 'border-gray-200': true };
  }

  getIconClasses(t: Transfer): { [key: string]: boolean } {
    if (this.isBonus(t)) return { 'bg-gradient-to-br': true, 'from-[#D5A928]': true, 'to-[#D5A928]/70': true };
    if (this.isIncome(t)) return { 'bg-gradient-to-br': true, 'from-[#3ACFD9]': true, 'to-[#3ACFD9]/70': true };
    if (this.isExpense(t)) return { 'bg-gradient-to-br': true, 'from-[#1F2937]': true, 'to-[#1F2937]/70': true };
    if (this.isError(t)) return { 'bg-red-500': true };
    return { 'bg-gray-400': true };
  }

  getAmountClasses(t: Transfer): { [key: string]: boolean } {
    if (this.isBonus(t)) return { 'text-[#D5A928]': true };
    if (this.isIncome(t)) return { 'text-[#3ACFD9]': true };
    if (this.isExpense(t)) return { 'text-[#1F2937]/70': true };
    return { 'text-gray-600': true };
  }

  getAmountDisplay(t: Transfer): string {
    return (t.fromUserId === this.user.id ? '-' : '+') + t.amount.toFixed(2) + '€';
  }

  getTransactionType(t: Transfer): string {
    if (this.isBonus(t)) return 'Bonus';
    if (this.isIncome(t)) return 'Income';
    if (this.isExpense(t)) return 'Expense';
    return 'Transaction';
  }

  // ← CALCOLI STATISTICHE
  getTotalIncome(): number {
    return this.history
      .filter(t => this.isIncome(t))
      .reduce((sum, t) => sum + t.amount, 0);
  }

  getTotalExpenses(): number {
    return this.history
      .filter(t => this.isExpense(t))
      .reduce((sum, t) => sum + t.amount, 0);
  }

  getTotalBonuses(): number {
    return this.history
      .filter(t => this.isBonus(t))
      .reduce((sum, t) => sum + t.amount, 0);
  }
}
