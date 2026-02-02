import { Injectable } from '@angular/core';
import { Observable, throwError, delay, of } from 'rxjs';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthMock {
  private storageKey = 'mockUsers';

  constructor() {}

  /** Recupera tutti gli utenti dal localStorage */
  private getUsers(): User[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  /** Salva tutti gli utenti nel localStorage */
  private saveUsers(users: User[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(users));
  }

  /** LOGIN MOCK */
  public login(email: string, password: string): Observable<User> {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u['password'] === password);

    if (!user) {
      return throwError(() => new Error('Invalid credentials')).pipe(delay(500));
    }

    // Salva sessione
    localStorage.setItem('currentUser', JSON.stringify(user));
    return of(user).pipe(delay(500));
  }

  /** LOGOUT MOCK */
  public logout() {
    localStorage.removeItem('currentUser');
  }

  /** Recupera l’utente corrente */
  public getCurrentUser(): User | null {
    const u = localStorage.getItem('currentUser');
    return u ? JSON.parse(u) : null;
  }

  /** REGISTRATION MOCK */
  public register(data: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    category: 'student' | 'regular' | 'premium';
  }): Observable<User> {

    let users = this.getUsers();

    // Controlla email duplicata
    if (users.some(u => u.email === data.email)) {
      alert('Email already registered')
      return throwError(() => new Error('Email already registered')).pipe(delay(500));
    }

    const newUser: User = {
      id: Date.now(),
      firstName: data.fullName,
      email: data.email,
      category: data.category,
      balance: data.category === 'student' ? 100 : 0,
      accountType: data.category,
      createdAt: new Date().toISOString(),
      offers: data.category === 'student' ? ['welcome_bonus'] : [],
      verified: true,
      password: data.password // aggiungo password solo per mock, non esiste nell'interfaccia reale
    } as User & { password: string }; // hack per mock

    users.push(newUser);
    this.saveUsers(users);

    // Salva sessione
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    return of(newUser).pipe(delay(500));
  }
}
