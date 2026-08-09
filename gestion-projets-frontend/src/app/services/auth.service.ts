import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Utilisateur, LoginRequest, LoginResponse, Role } from '../models/utilisateur';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private apiUrl = 'http://localhost:8082/api/auth';
  
  currentUser = signal<Utilisateur | null>(null);
  isAuthenticated = signal(false);

  constructor() {
    // Vérifier si l'utilisateur est déjà connecté (session)
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUser.set(JSON.parse(savedUser));
      this.isAuthenticated.set(true);
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response.success) {
          this.currentUser.set(response.utilisateur);
          this.isAuthenticated.set(true);
          localStorage.setItem('currentUser', JSON.stringify(response.utilisateur));
        }
      })
    );
  }

  register(utilisateur: Utilisateur): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(`${this.apiUrl}/register`, utilisateur);
  }

  logout(): void {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === Role.ADMIN;
  }

  isUtilisateur(): boolean {
    return this.currentUser()?.role === Role.UTILISATEUR;
  }
}