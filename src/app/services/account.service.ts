import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Account } from '../interfaces/account.interface';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Récupère le compte d'un utilisateur (AccountService)
  public getAccountByUserId(userId: number): Observable<Account> {
    return this.http.get<Account[]>(`${this.baseUrl}/accounts?userId=${userId}`).pipe(
      map(accounts => accounts[0])
    );
  }

  // Met à jour le solde (Simule la persistance)
  public updateBalance(accountId: number, newBalance: number): Observable<Account> {
    return this.http.patch<Account>(`${this.baseUrl}/accounts/${accountId}`, { balance: newBalance });
  }
  
}
