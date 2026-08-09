import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TacheService } from '../../../services/tache.service';
import { ProjetService } from '../../../services/projet.service';
import { Tache, Statut, STATUT_LABELS } from '../../../models/tache';
import { Projet } from '../../../models/projet';

@Component({
  selector: 'app-gestion-taches',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './gestion-taches.html',
  styleUrls: ['./gestion-taches.css']
})
export class GestionTachesComponent implements OnInit {
  private tacheService = inject(TacheService);
  private projetService = inject(ProjetService);

  taches = signal<Tache[]>([]);
  projets = signal<Projet[]>([]);
  loading = signal(false);
  statutLabels = STATUT_LABELS;

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);

    this.projetService.getAll().subscribe({
      next: (data) => this.projets.set(data)
    });

    this.tacheService.getAll().subscribe({
      next: (data) => {
        this.taches.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  deleteTache(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette tâche ?')) {
      this.tacheService.delete(id).subscribe({
        next: () => this.loadData()
      });
    }
  }

  getStatutClass(statut: Statut): string {
    switch(statut) {
      case Statut.A_FAIRE: return 'status-todo';
      case Statut.EN_COURS: return 'status-inprogress';
      case Statut.TERMINE: return 'status-done';
      default: return '';
    }
  }

  getProjetNom(projetId: number | undefined): string {
    if (!projetId) return '—';
    const projet = this.projets().find(p => p.id === projetId);
    return projet ? projet.nom : '—';
  }
}