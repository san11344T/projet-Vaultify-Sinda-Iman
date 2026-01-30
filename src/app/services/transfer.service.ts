import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import { Transfer } from '../interfaces/transfer.interface';
import { User } from '../interfaces/user.interface';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class TransferService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, private accountS: AccountService) {}

  public getHistory(userId: number): Observable<Transfer[]> {
    return this.http.get<Transfer[]>(`${this.baseUrl}/transfers`).pipe(
      map(txs => txs.filter(t => t.fromUserId === userId || t.toUserId === userId))
    );
  }

  // Logique complexe de virement (TransferService)
  public executeTransfer(senderId: number, receiverEmail: string, amount: number): Observable<any> {
    // 1. Trouver destinataire
    return this.http.get<User[]>(`${this.baseUrl}/users?email=${receiverEmail}`).pipe(
      switchMap(users => {
        if (users.length === 0) throw new Error('Destinataire introuvable');
        const receiver = users[0];

        // 2. Récupérer les comptes (Sender et Receiver)
        return forkJoin({
          senderAcc: this.accountS.getAccountByUserId(senderId),
          receiverAcc: this.accountS.getAccountByUserId(receiver.id)
        }).pipe(
          switchMap(({ senderAcc, receiverAcc }) => {
             // 3. Exécuter : Créer Transaction + Update Soldes
             const tx: Transfer = {
               fromUserId: senderId, toUserId: receiver.id, amount,
               date: new Date().toISOString(), status: 'COMPLETED', label: `Virement vers ${receiver.firstName}`
             };

             return forkJoin([
               this.http.post(`${this.baseUrl}/transfers`, tx),
               this.accountS.updateBalance(senderAcc.id, senderAcc.balance - amount),
               this.accountS.updateBalance(receiverAcc.id, receiverAcc.balance + amount)
             ]);
          })
        );
      })
    );
  }
  
}
