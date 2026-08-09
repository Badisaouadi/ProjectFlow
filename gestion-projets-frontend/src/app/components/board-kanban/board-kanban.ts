import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TacheService } from '../../services/tache.service';
import { Tache, Statut } from '../../models/tache';
import { SousTacheListComponent } from '../sous-tache-list/sous-tache-list';

@Component({
  selector: 'app-board-kanban',
  standalone: true,
  imports: [CommonModule, SousTacheListComponent],
  templateUrl: './board-kanban.html',
  styleUrls: ['./board-kanban.css']
})
export class BoardKanbanComponent implements OnInit {
  taches: Tache[] = [];
  statuts = Statut;
  expandedTache: number | null = null;

  constructor(private tacheService: TacheService) {}

  ngOnInit(): void {
    this.loadTaches();
  }

  loadTaches(): void {
    this.tacheService.getAll().subscribe({
      next: (data) => {
        this.taches = data;
      }
    });
  }

  getTachesByStatut(statut: Statut): Tache[] {
    return this.taches.filter(t => t.statut === statut);
  }

  getStatutLabel(statut: Statut): string {
    return statut.replace('_', ' ');
  }

  getStatutColor(statut: Statut): string {
    switch(statut) {
      case Statut.A_FAIRE: return '#f6ad55';
      case Statut.EN_COURS: return '#4299e1';
      case Statut.TERMINE: return '#48bb78';
      default: return '#a0aec0';
    }
  }

  toggleSousTaches(tacheId: number): void {
    this.expandedTache = this.expandedTache === tacheId ? null : tacheId;
  }
}