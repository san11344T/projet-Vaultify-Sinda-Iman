import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AccountService } from '../../services/account.service';
import { TransferService } from '../../services/transfer.service';
import { AdvisorService } from '../../services/advisor.service';
import { User } from '../../interfaces/user.interface';
import { Account } from '../../interfaces/account.interface';
import { Transfer } from '../../interfaces/transfer.interface';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './account.html',
  styleUrl: './account.scss',
})
export class AccountComponent implements OnInit {
  user: User | undefined;
  account: Account | undefined;
  history: Transfer[] = [];

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

    // On charge le compte et l'historique
    this.accountS.getAccountByUserId(local.id).subscribe(acc => this.account = acc);
    this.transferS.getHistory(local.id).subscribe(h => this.history = h);
  }

  // Création de demande auprès du conseiller
  createRequest(type: 'LIVRET_A' | 'CLOSURE' | 'INSURANCE') {
    // 1. SÉCURITÉ : Si l'utilisateur n'est pas chargé, on arrête tout
    if (!this.user) return;

    // 2. Confirmation et envoi
    if(confirm('Voulez-vous vraiment envoyer cette demande à votre conseiller ?')) {
      this.advisorS.createRequest(this.user.id, type).subscribe(() => {
        alert('Votre demande a bien été envoyée !');
      });
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
