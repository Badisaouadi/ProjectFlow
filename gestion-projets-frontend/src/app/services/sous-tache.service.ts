import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SousTache } from '../models/sous-tache';

@Injectable({
  providedIn: 'root'
})
export class SousTacheService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8082/api/sous-taches';

  getAll(): Observable<SousTache[]> {
    return this.http.get<SousTache[]>(this.apiUrl);
  }

  getByTache(tacheId: number): Observable<SousTache[]> {
    return this.http.get<SousTache[]>(`${this.apiUrl}/tache/${tacheId}`);
  }

  getById(id: number): Observable<SousTache> {
    return this.http.get<SousTache>(`${this.apiUrl}/${id}`);
  }

  create(tacheId: number, sousTache: SousTache): Observable<SousTache> {
    return this.http.post<SousTache>(`${this.apiUrl}/tache/${tacheId}`, sousTache);
  }

  update(id: number, sousTache: SousTache): Observable<SousTache> {
    return this.http.put<SousTache>(`${this.apiUrl}/${id}`, sousTache);
  }

  toggle(id: number): Observable<SousTache> {
    return this.http.patch<SousTache>(`${this.apiUrl}/${id}/toggle`, {});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}