import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TransferService } from '../../services/transfer.service';
import { AuthService } from '../../services/auth.service';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './transfer.html',
  styleUrl: './transfer.scss',
})
export class TransferComponent {
  emailDest = '';
  montant = 0;

  constructor(
    private transferS: TransferService,
    private auth: AuthService,
    private accountS: AccountService,
    private router: Router
  ) {}

  public valider() {
    const user = this.auth.getCurrentUser();
    if(!user) return;

    this.accountS.getAccountByUserId(user.id).subscribe(acc => {
       if(acc.balance < this.montant) { alert('Solde insuffisant'); return; }

       this.transferS.executeTransfer(user.id, this.emailDest, this.montant).subscribe({
         next: () => { alert('Virement réussi'); this.router.navigate(['/account']); },
         error: () => alert('Erreur (Email introuvable ?)')
       });
    });
  }
}
