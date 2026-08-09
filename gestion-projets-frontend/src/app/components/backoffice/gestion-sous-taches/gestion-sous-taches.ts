import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SousTacheService } from '../../../services/sous-tache.service';
import { TacheService } from '../../../services/tache.service';
import { SousTache } from '../../../models/sous-tache';
import { Tache } from '../../../models/tache';

@Component({
  selector: 'app-gestion-sous-taches',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './gestion-sous-taches.html',
  styleUrls: ['./gestion-sous-taches.css']
})
export class GestionSousTachesComponent implements OnInit {
  private sousTacheService = inject(SousTacheService);
  private tacheService = inject(TacheService);

  sousTaches = signal<SousTache[]>([]);
  taches = signal<Tache[]>([]);
  loading = signal(false);
  showForm = signal(false);
  editingId = signal<number | null>(null);

  formData: SousTache = {
    titre: '',
    description: '',
    terminee: false,
    tacheId: undefined
  };

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    
    this.sousTacheService.getAll().subscribe({
      next: (data) => {
        this.sousTaches.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });

    this.tacheService.getAll().subscribe({
      next: (data) => this.taches.set(data)
    });
  }

  openCreateForm(): void {
    this.formData = { titre: '', description: '', terminee: false, tacheId: undefined };
    this.editingId.set(null);
    this.showForm.set(true);
  }

  openEditForm(sousTache: SousTache): void {
    this.formData = { ...sousTache };
    this.editingId.set(sousTache.id!);
    this.showForm.set(true);
  }

  cancelForm(): void {
    this.showForm.set(false);
    this.editingId.set(null);
    this.formData = { titre: '', description: '', terminee: false, tacheId: undefined };
  }

  saveSousTache(): void {
    if (!this.formData.titre || !this.formData.tacheId) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    this.loading.set(true);

    if (this.editingId()) {
      this.sousTacheService.update(this.editingId()!, this.formData).subscribe({
        next: () => {
          this.loadData();
          this.cancelForm();
        },
        error: () => this.loading.set(false)
      });
    } else {
      this.sousTacheService.create(this.formData.tacheId, this.formData).subscribe({
        next: () => {
          this.loadData();
          this.cancelForm();
        },
        error: () => this.loading.set(false)
      });
    }
  }

  toggleSousTache(id: number): void {
    this.sousTacheService.toggle(id).subscribe({
      next: () => this.loadData()
    });
  }

  deleteSousTache(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette sous-tâche ?')) {
      this.sousTacheService.delete(id).subscribe({
        next: () => this.loadData()
      });
    }
  }

  getTacheName(id: number): string {
    const tache = this.taches().find(t => t.id === id);
    return tache ? tache.titre : 'Inconnu';
  }
}