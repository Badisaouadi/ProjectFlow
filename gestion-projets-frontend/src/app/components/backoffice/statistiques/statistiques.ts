import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjetService } from '../../../services/projet.service';
import { TacheService } from '../../../services/tache.service';
import { UtilisateurService } from '../../../services/utilisateur.service';
import { Tache, Statut, Priorite } from '../../../models/tache';

@Component({
  selector: 'app-statistiques',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statistiques.html',
  styleUrls: ['./statistiques.css']
})
export class StatistiquesComponent implements OnInit {
  private projetService = inject(ProjetService);
  private tacheService = inject(TacheService);
  private utilisateurService = inject(UtilisateurService);

  loading = signal(true);

  totalProjets = signal(0);
  totalTaches = signal(0);
  totalUtilisateurs = signal(0);

  tachesAFaire = signal(0);
  tachesEnCours = signal(0);
  tachesTerminees = signal(0);

  tachesCritiques = signal(0);
  tachesHaute = signal(0);
  tachesMoyenne = signal(0);
  tachesBasse = signal(0);

  tauxAvancement = signal(0);

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading.set(true);

    this.projetService.getAll().subscribe({
      next: (projets) => this.totalProjets.set(projets.length)
    });

    this.utilisateurService.getAll().subscribe({
      next: (users) => this.totalUtilisateurs.set(users.length)
    });

    this.tacheService.getAll().subscribe({
      next: (taches: Tache[]) => {
        this.totalTaches.set(taches.length);

        this.tachesAFaire.set(taches.filter(t => t.statut === Statut.A_FAIRE).length);
        this.tachesEnCours.set(taches.filter(t => t.statut === Statut.EN_COURS).length);
        this.tachesTerminees.set(taches.filter(t => t.statut === Statut.TERMINE).length);

        this.tachesCritiques.set(taches.filter(t => t.priorite === Priorite.CRITIQUE).length);
        this.tachesHaute.set(taches.filter(t => t.priorite === Priorite.HAUTE).length);
        this.tachesMoyenne.set(taches.filter(t => t.priorite === Priorite.MOYENNE).length);
        this.tachesBasse.set(taches.filter(t => t.priorite === Priorite.BASSE).length);

        const total = taches.length;
        const terminees = this.tachesTerminees();
        this.tauxAvancement.set(total > 0 ? Math.round((terminees / total) * 100) : 0);

        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  getPercent(value: number): number {
    return this.totalTaches() > 0 ? Math.round((value / this.totalTaches()) * 100) : 0;
  }
}