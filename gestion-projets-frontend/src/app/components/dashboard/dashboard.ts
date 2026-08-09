import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TacheService } from '../../services/tache.service';
import { ProjetService } from '../../services/projet.service';
import { Tache, Statut } from '../../models/tache';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  totalProjets = 0;
  totalTaches = 0;
  tachesTerminees = 0;
  tachesEnCours = 0;
  tachesAFaire = 0;
  tauxAvancement = 0;
  
  // Statistiques par priorité
  tachesCritiques = 0;
  tachesHaute = 0;
  tachesMoyenne = 0;
  tachesBasse = 0;

  // Évolution mensuelle (simulée)
  evolutionMensuelle = [
    { mois: 'Jan', total: 5, terminees: 3, enCours: 2 },
    { mois: 'Fév', total: 8, terminees: 5, enCours: 3 },
    { mois: 'Mar', total: 12, terminees: 8, enCours: 4 },
    { mois: 'Avr', total: 10, terminees: 7, enCours: 3 },
    { mois: 'Mai', total: 15, terminees: 12, enCours: 3 },
    { mois: 'Juin', total: 20, terminees: 15, enCours: 5 }
  ];

  constructor(
    private projetService: ProjetService,
    private tacheService: TacheService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.projetService.getAll().subscribe({
      next: (projets) => {
        this.totalProjets = projets.length;
      }
    });

    this.tacheService.getAll().subscribe({
      next: (taches) => {
        this.totalTaches = taches.length;
        this.tachesTerminees = taches.filter(t => t.statut === Statut.TERMINE).length;
        this.tachesEnCours = taches.filter(t => t.statut === Statut.EN_COURS).length;
        this.tachesAFaire = taches.filter(t => t.statut === Statut.A_FAIRE).length;
        
        this.tachesCritiques = taches.filter(t => t.priorite === 'CRITIQUE').length;
        this.tachesHaute = taches.filter(t => t.priorite === 'HAUTE').length;
        this.tachesMoyenne = taches.filter(t => t.priorite === 'MOYENNE').length;
        this.tachesBasse = taches.filter(t => t.priorite === 'BASSE').length;
        
        this.tauxAvancement = this.totalTaches > 0 
          ? Math.round((this.tachesTerminees / this.totalTaches) * 100) 
          : 0;
      }
    });
  }

  getProgressColor(): string {
    if (this.tauxAvancement < 30) return '#fc8181';
    if (this.tauxAvancement < 60) return '#fbd38d';
    if (this.tauxAvancement < 80) return '#68d391';
    return '#48bb78';
  }
}