import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProjetService } from '../../../services/projet.service';
import { TacheService } from '../../../services/tache.service';
import { Projet } from '../../../models/projet';
import { Tache, Statut } from '../../../models/tache';

interface ProjetAvecStats extends Projet {
  nombreTaches: number;
  tachesTerminees: number;
  taux: number;
}

@Component({
  selector: 'app-projets',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './projets.html',
  styleUrls: ['./projets.css']
})
export class ProjetsComponent implements OnInit {
  private projetService = inject(ProjetService);
  private tacheService = inject(TacheService);
  private router = inject(Router);

  projets = signal<ProjetAvecStats[]>([]);
  loading = signal(false);
  error = signal('');

  // Modal détail projet
  showModal = signal(false);
  selectedProjet = signal<ProjetAvecStats | null>(null);
  tachesDuProjet = signal<Tache[]>([]);
  loadingTaches = signal(false);

  ngOnInit(): void {
    this.loadProjets();
  }

  loadProjets(): void {
    this.loading.set(true);
    this.error.set('');

    this.projetService.getAll().subscribe({
      next: (projets) => {
        this.tacheService.getAll().subscribe({
          next: (taches) => {
            const projetsAvecStats: ProjetAvecStats[] = projets.map(p => {
              const tachesDuProjet = taches.filter(t => t.projetId === p.id);
              const terminees = tachesDuProjet.filter(t => t.statut === Statut.TERMINE).length;
              const total = tachesDuProjet.length;
              return {
                ...p,
                nombreTaches: total,
                tachesTerminees: terminees,
                taux: total > 0 ? Math.round((terminees / total) * 100) : 0
              };
            });
            this.projets.set(projetsAvecStats);
            this.loading.set(false);
          },
          error: () => {
            this.projets.set(projets.map(p => ({ ...p, nombreTaches: 0, tachesTerminees: 0, taux: 0 })));
            this.loading.set(false);
          }
        });
      },
      error: () => {
        this.error.set('Erreur lors du chargement des projets');
        this.loading.set(false);
      }
    });
  }

  openDetail(projet: ProjetAvecStats): void {
    this.selectedProjet.set(projet);
    this.showModal.set(true);
    this.loadTachesDuProjet(projet.id!);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.selectedProjet.set(null);
    this.tachesDuProjet.set([]);
  }

  loadTachesDuProjet(projetId: number): void {
    this.loadingTaches.set(true);
    this.tacheService.getByProjet(projetId).subscribe({
      next: (data) => {
        this.tachesDuProjet.set(data);
        this.loadingTaches.set(false);
      },
      error: () => this.loadingTaches.set(false)
    });
  }

  goToBoard(): void {
    this.router.navigate(['/fo/board']);
  }

  getStatutLabel(statut: Statut): string {
    const labels: Record<string, string> = {
      A_FAIRE: 'À faire', EN_COURS: 'En cours', TERMINE: 'Terminé'
    };
    return labels[statut] || statut;
  }

  getStatutClass(statut: Statut): string {
    return 'statut-' + statut.toLowerCase();
  }
}