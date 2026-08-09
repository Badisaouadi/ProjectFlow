import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tache, Statut } from '../models/tache';

@Injectable({
  providedIn: 'root'
})
export class TacheService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8082/api/taches';

  getAll(): Observable<Tache[]> {
    return this.http.get<Tache[]>(this.apiUrl);
  }

  getById(id: number): Observable<Tache> {
    return this.http.get<Tache>(`${this.apiUrl}/${id}`);
  }

  getByProjet(projetId: number): Observable<Tache[]> {
    return this.http.get<Tache[]>(`${this.apiUrl}/projet/${projetId}`);
  }

  getByStatut(statut: Statut): Observable<Tache[]> {
    return this.http.get<Tache[]>(`${this.apiUrl}/statut/${statut}`);
  }

  create(projetId: number, tache: Tache): Observable<Tache> {
    return this.http.post<Tache>(`${this.apiUrl}/projet/${projetId}`, tache);
  }

  update(id: number, tache: Tache): Observable<Tache> {
    return this.http.put<Tache>(`${this.apiUrl}/${id}`, tache);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}