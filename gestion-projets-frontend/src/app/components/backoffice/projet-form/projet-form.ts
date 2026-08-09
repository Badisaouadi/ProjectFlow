import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjetService } from '../../../services/projet.service';
import { Projet } from '../../../models/projet';

@Component({
  selector: 'app-projet-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './projet-form.html',
  styleUrls: ['./projet-form.css']
})
export class ProjetFormComponent implements OnInit {
  private projetService = inject(ProjetService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  projet: Projet = { nom: '', description: '' };
  isEditMode = signal(false);
  loading = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode.set(true);
      this.loadProjet(+id);
    }
  }

  loadProjet(id: number): void {
    this.loading.set(true);
    this.projetService.getById(id).subscribe({
      next: (data) => {
        this.projet = data;
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onSubmit(): void {
    if (!this.projet.nom) {
      alert('Le nom du projet est obligatoire');
      return;
    }

    this.loading.set(true);
    const operation = this.isEditMode()
      ? this.projetService.update(this.projet.id!, this.projet)
      : this.projetService.create(this.projet);

    operation.subscribe({
      next: () => this.router.navigate(['/admin/projets']),
      error: () => {
        this.loading.set(false);
        alert('Erreur lors de l\'enregistrement');
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/projets']);
  }
}