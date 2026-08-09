import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SousTacheService } from '../../services/sous-tache.service';
import { SousTache } from '../../models/sous-tache';

@Component({
  selector: 'app-sous-tache-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sous-tache-list.html',
  styleUrls: ['./sous-tache-list.css']
})
export class SousTacheListComponent implements OnInit {
  @Input() tacheId!: number;
  sousTaches: SousTache[] = [];
  loading = false;
  newSousTache: SousTache = {
    titre: '',
    description: '',
    terminee: false
  };
  showForm = false;

  constructor(private sousTacheService: SousTacheService) {}

  ngOnInit(): void {
    this.loadSousTaches();
  }

  loadSousTaches(): void {
    this.loading = true;
    this.sousTacheService.getByTache(this.tacheId).subscribe({
      next: (data) => {
        this.sousTaches = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  addSousTache(): void {
    if (!this.newSousTache.titre) return;
    
    this.sousTacheService.create(this.tacheId, this.newSousTache).subscribe({
      next: () => {
        this.newSousTache = { titre: '', description: '', terminee: false };
        this.showForm = false;
        this.loadSousTaches();
      }
    });
  }

  toggleTerminee(sousTache: SousTache): void {
    sousTache.terminee = !sousTache.terminee;
    this.sousTacheService.update(sousTache.id!, sousTache).subscribe({
      next: () => this.loadSousTaches()
    });
  }

  deleteSousTache(id: number): void {
    if (confirm('Supprimer cette sous-tâche ?')) {
      this.sousTacheService.delete(id).subscribe({
        next: () => this.loadSousTaches()
      });
    }
  }
}