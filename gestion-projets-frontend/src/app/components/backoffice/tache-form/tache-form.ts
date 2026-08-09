import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TacheService } from '../../../services/tache.service';
import { ProjetService } from '../../../services/projet.service';
import { Tache, Statut, Priorite } from '../../../models/tache';
import { Projet } from '../../../models/projet';

@Component({
  selector: 'app-tache-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tache-form.html',
  styleUrls: ['./tache-form.css']
})
export class TacheFormComponent implements OnInit {
  private tacheService = inject(TacheService);
  private projetService = inject(ProjetService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  tache: Tache = {
    titre: '',
    description: '',
    statut: Statut.A_FAIRE,
    priorite: Priorite.MOYENNE,
    projetId: undefined
  };

  projets = signal<Projet[]>([]);
  isEditMode = signal(false);
  loading = signal(false);

  statuts = Object.values(Statut);
  priorites = Object.values(Priorite);

  ngOnInit(): void {
    this.loadProjets();

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode.set(true);
      this.loadTache(+id);
    }
  }

  loadProjets(): void {
    this.projetService.getAll().subscribe({
      next: (data) => this.projets.set(data)
    });
  }

  loadTache(id: number): void {
    this.loading.set(true);
    this.tacheService.getById(id).subscribe({
      next: (data) => {
        this.tache = data;
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onSubmit(): void {
    if (!this.tache.titre || !this.tache.projetId) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    this.loading.set(true);

    // Nettoyer le payload : ne pas envoyer dateEcheance vide
    const payload: any = { ...this.tache };
    if (!payload.dateEcheance) {
      delete payload.dateEcheance;
    } else {
      payload.dateEcheance = payload.dateEcheance + 'T00:00:00';
    }

    console.log('📤 Payload envoyé:', payload);

    const operation = this.isEditMode()
      ? this.tacheService.update(this.tache.id!, payload)
      : this.tacheService.create(this.tache.projetId, payload);

    operation.subscribe({
      next: () => this.router.navigate(['/admin/taches']),
      error: (err) => {
        console.error('❌ Erreur complète:', err);
        console.error('   Status:', err.status);
        console.error('   Message backend:', err.error);
        this.loading.set(false);
        alert('Erreur: ' + (err.error?.message || err.message || 'Erreur inconnue'));
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/taches']);
  }

  getStatutLabel(statut: string): string {
    return statut.replace('_', ' ');
  }
}