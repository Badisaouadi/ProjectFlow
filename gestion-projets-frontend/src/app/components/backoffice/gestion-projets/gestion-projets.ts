import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjetService } from '../../../services/projet.service';
import { Projet } from '../../../models/projet';

@Component({
  selector: 'app-gestion-projets',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './gestion-projets.html',
  styleUrls: ['./gestion-projets.css']
})
export class GestionProjetsComponent implements OnInit {
  private projetService = inject(ProjetService);

  projets = signal<Projet[]>([]);
  loading = signal(false);

  ngOnInit(): void {
    this.loadProjets();
  }

  loadProjets(): void {
    this.loading.set(true);
    this.projetService.getAll().subscribe({
      next: (data) => {
        this.projets.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  deleteProjet(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce projet ?')) {
      this.projetService.delete(id).subscribe({
        next: () => this.loadProjets()
      });
    }
  }
}