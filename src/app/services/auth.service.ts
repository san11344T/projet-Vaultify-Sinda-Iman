// auth.service.ts - OTTIMIZZATO per join ID corretti
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap, throwError, forkJoin } from 'rxjs';
import { Auth } from '../interfaces/auth.interface';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  // Login - Ottimizzato per join auth.users → users.id
  public login(email: string, mdp: string): Observable<User> {
    return this.http.get<Auth[]>(`${this.baseUrl}/auth?email=${email}&password=${mdp}`).pipe(
      switchMap(auths => {
        if (auths.length === 0) {
          return throwError(() => new Error('Identifiants invalides'));
        }
        
        const userId = auths[0].id; // ID numerico dall'auth
        
        // Get user con ID esatto
        return this.http.get<User[]>(`${this.baseUrl}/users?id=${userId}`).pipe(
          map(users => {
            if (!users || users.length === 0) {
              throw new Error('User not found');
            }
            const user = users[0];
            localStorage.setItem('currentUser', JSON.stringify(user));
            return user;
          })
        );
      })
    );
  }

  public logout() { 
    localStorage.removeItem('currentUser'); 
  }

  public getCurrentUser(): User | null {
    const u = localStorage.getItem('currentUser');
    return u ? JSON.parse(u) : null;
  }

  // Register - Crea TUTTO con ID coerenti
  public register(data: {
    fullName: string;
    email: string;
    phone?: string;
    password: string;
    category: string;
  }): Observable<User> {

    // Divide fullName
    const [firstName, ...rest] = data.fullName.trim().split(' ');
    const lastName = rest.join(' ') || '';

    // 1️⃣ Crea USER con ID auto-generato dal backend
    return this.http.post<User>(`${this.baseUrl}/users`, {
      firstName,
      lastName,
      email: data.email,
      category: data.category,
      offers: [] // default vuoto
    }).pipe(
      switchMap(user => {
        // 2️⃣ Crea AUTH con userId = user.id (numerico)
        return this.http.post<Auth>(`${this.baseUrl}/auth`, {
          id: user.id, // ID auth = ID user
          email: data.email,
          password: data.password,
          role: 'client'
        }).pipe(
          switchMap(() => {
            // 3️⃣ Crea ACCOUNT con userId = user.id (numerico)
            return this.http.post(`${this.baseUrl}/accounts`, {
              userId: String(user.id), // ← ESATTO join con users.id
              balance: user.category === 'student'? 100 :0,
              type: 'CHECKING',
              rib: this.generateRib()
            }).pipe(
              map(() => {
                // 4️⃣ Salva in localStorage
                localStorage.setItem('currentUser', JSON.stringify(user));
                return user;
              })
            );
          })
        );
      })
    );
  }

  // Genera RIB fittizio
  private generateRib(): string {
    const randomDigits = () => Math.floor(1000 + Math.random() * 9000);
    return `FR76 ${randomDigits()} ${randomDigits()} ${randomDigits()}`;
  }
}
