import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap, throwError } from 'rxjs';
import { Auth } from '../interfaces/auth.interface';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Simule le login AuthResource
  public login(email: string, mdp: string): Observable<User> {
    return this.http.get<Auth[]>(`${this.baseUrl}/auth?email=${email}&password=${mdp}`).pipe(
      switchMap(res => {
        if (res.length === 0) return throwError(() => new Error('Identifiants invalides'));
        // Si auth ok, on récupère le profil User
        return this.http.get<User[]>(`${this.baseUrl}/users?id=${res[0].userId}`).pipe(
          map(users => {
            const user = users[0];
            localStorage.setItem('currentUser', JSON.stringify(user)); // Sauvegarde session
            return user;
          })
        );
      })
    );
  }

  public logout() { localStorage.removeItem('currentUser'); }
  
  public getCurrentUser(): User | null {
    const u = localStorage.getItem('currentUser');
    return u ? JSON.parse(u) : null;
  }
}
