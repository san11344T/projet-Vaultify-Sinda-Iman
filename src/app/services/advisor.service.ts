import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Advisor } from '../interfaces/advisor.interface';

@Injectable({
  providedIn: 'root'
})
export class AdvisorService {
  private baseUrl = 'http://localhost:3000';
  constructor(private http: HttpClient) {}

  public createRequest(userId: number, type: any): Observable<Request> {
    const req = { userId, type, status: 'PENDING', date: new Date().toISOString() };
    return this.http.post<Request>(`${this.baseUrl}/requests`, req);
  }
}
