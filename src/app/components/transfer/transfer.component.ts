// transfer.component.ts - ADATTATO al tuo TS esistente
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TransferService } from '../../services/transfer.service';
import { AuthService } from '../../services/auth.service';
import { AccountService } from '../../services/account.service';
import { Navbar } from "../navbar/navbar.component";

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [Navbar,CommonModule, FormsModule, RouterModule],
  templateUrl: './transfer.html',
  styleUrl: './transfer.scss',
})
export class TransferComponent implements OnInit {
  emailDest = '';
  montant = 0;
  description = ''; // ← AGGIUNTO (opzionale)

  // ← NUOVE VARIABILI per UI
  currentBalance = 0;
  insufficientFunds = false;
  showInsufficientDialog = false;

  constructor(
    private transferS: TransferService,
    private auth: AuthService,
    private accountS: AccountService,
    private router: Router
  ) {}

  ngOnInit() {
    // ← CARICA BALANCE ALL'AVVIO (non rompe logica esistente)
    const user = this.auth.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.accountS.getAccountByUserId(user.id).subscribe(acc => {
      this.currentBalance = acc.balance;
    });
  }

  public valider() {
    const user = this.auth.getCurrentUser();
    if(!user) return;

    // ← CHECK INSUFFICIENT FUNDS con tua logica
    if(this.currentBalance < this.montant) { 
      this.insufficientFunds = true;
      this.showInsufficientDialog = true;
      return; 
    }

    // ← RESET ERROR STATE
    this.insufficientFunds = false;

    // ← TUA LOGICA ORIGINALE (mantenuta)
    this.accountS.getAccountByUserId(user.id).subscribe(acc => {
       if(acc.balance < this.montant) { 
         alert('Solde insuffisant'); 
         return; 
       }

       this.transferS.executeTransfer(user.id, this.emailDest, this.montant).subscribe({
         next: () => { 
           alert('Virement réussi'); 
           this.router.navigate(['/account']); 
         },
         error: () => alert('Erreur (Email introuvable ?)')
       });
    });
  }

  // ← METODI PER DIALOG
  closeInsufficientDialog() {
    this.showInsufficientDialog = false;
    this.insufficientFunds = false;
  }

  // ← GETTER PER TEMPLATE
  get isFormValid(): boolean {
    return this.montant > 0 && this.emailDest.trim().length > 0;
  }
}
