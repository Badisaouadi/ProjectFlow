import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ProjetService } from '../../../services/projet.service';
import { TacheService } from '../../../services/tache.service';
import { UtilisateurService } from '../../../services/utilisateur.service';
import { Tache, Statut } from '../../../models/tache';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent implements OnInit {
  authService = inject(AuthService);
  private projetService = inject(ProjetService);
  private tacheService = inject(TacheService);
  private utilisateurService = inject(UtilisateurService);

  today = new Date();
  
  // Statistiques
  totalProjets = signal(0);
  totalTaches = signal(0);
  tachesTerminees = signal(0);
  tachesEnCours = signal(0);
  totalUtilisateurs = signal(0);
  tauxAvancement = signal(0);
  
  // Derniers projets
  derniersProjets = signal<any[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    
    // Charger les projets
    this.projetService.getAll().subscribe({
      next: (projets) => {
        this.totalProjets.set(projets.length);
        this.derniersProjets.set(projets.slice(-3).reverse());
      },
      error: () => console.error('Erreur chargement projets')
    });

    // Charger les tâches
    this.tacheService.getAll().subscribe({
      next: (taches) => {
        this.totalTaches.set(taches.length);
        this.tachesTerminees.set(taches.filter(t => t.statut === Statut.TERMINE).length);
        this.tachesEnCours.set(taches.filter(t => t.statut === Statut.EN_COURS).length);
        
        const total = taches.length;
        const terminees = taches.filter(t => t.statut === Statut.TERMINE).length;
        this.tauxAvancement.set(total > 0 ? Math.round((terminees / total) * 100) : 0);
      },
      error: () => console.error('Erreur chargement tâches')
    });

    // Charger les utilisateurs
    this.utilisateurService.getAll().subscribe({
      next: (users) => {
        this.totalUtilisateurs.set(users.length);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  getProgressColor(): string {
    const taux = this.tauxAvancement();
    if (taux < 30) return '#EF4444';
    if (taux < 60) return '#F59E0B';
    if (taux < 80) return '#3B82F6';
    return '#22C55E';
  }
}