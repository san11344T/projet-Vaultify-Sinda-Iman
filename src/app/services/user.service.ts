import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { forkJoin } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { Account } from '../interfaces/account.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

public register(prenom: string, nom: string, email: string, mdp: string, category: 'student'|'regular'): Observable<any> {
    const startBalance = category === 'student' ? 100 : 0;
    
    // 1. On crée le profil utilisateur pour obtenir un ID
    const userPayload = { 
      firstName: prenom, 
      lastName: nom, 
      email: email, 
      category: category, 
      offers: category === 'student' ? ['welcome_bonus'] : [] 
    };
    
    return this.http.post<any>(`${this.baseUrl}/users`, userPayload).pipe(
      switchMap((createdUser) => {
        // On récupère l'ID (createdUser.id)
        console.log('User créé avec ID:', createdUser.id);

        // 2. On crée l'Auth en utilisant CET ID
        const authPayload = { 
          email: email, 
          password: mdp, 
          role: 'client', 
          userId: createdUser.id 
        };
        
        // 3. On crée le Compte en utilisant CET ID
        const accountPayload = { 
          userId: createdUser.id, 
          balance: startBalance, 
          type: 'CHECKING', 
          rib: `FR76 ${Date.now()}` 
        };
        
        // On lance les deux créations en parallèle
        return forkJoin([
            this.http.post(`${this.baseUrl}/auth`, authPayload),
            this.http.post(`${this.baseUrl}/accounts`, accountPayload)
        ]);
      })
    );
  }

  public getUserByEmail(email: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users?email=${email}`);
  }
  
}
