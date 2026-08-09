import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjetService } from '../../../services/projet.service';
import { TacheService } from '../../../services/tache.service';
import { Tache, Statut } from '../../../models/tache';

interface MoisStats {
  key: string;       // '2026-07'
  label: string;      // 'Juil. 2026'
  total: number;
  terminees: number;
  enCours: number;
  aFaire: number;
  taux: number;
}

@Component({
  selector: 'app-front-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  private projetService = inject(ProjetService);
  private tacheService = inject(TacheService);

  loading = signal(true);

  totalProjets = signal(0);
  totalTaches = signal(0);
  tachesTerminees = signal(0);
  tachesEnCours = signal(0);
  tachesAFaire = signal(0);
  tauxAvancement = signal(0);

  moisStats = signal<MoisStats[]>([]);
  maxTotalMois = signal(1); // pour l'échelle des barres

  private readonly MOIS_LABELS = [
    'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
    'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'
  ];

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);

    this.projetService.getAll().subscribe({
      next: (projets) => this.totalProjets.set(projets.length)
    });

    this.tacheService.getAll().subscribe({
      next: (taches) => {
        this.totalTaches.set(taches.length);
        this.tachesTerminees.set(taches.filter(t => t.statut === Statut.TERMINE).length);
        this.tachesEnCours.set(taches.filter(t => t.statut === Statut.EN_COURS).length);
        this.tachesAFaire.set(taches.filter(t => t.statut === Statut.A_FAIRE).length);

        const total = taches.length;
        const terminees = this.tachesTerminees();
        this.tauxAvancement.set(total > 0 ? Math.round((terminees / total) * 100) : 0);

        this.computeMonthlyStats(taches);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  private computeMonthlyStats(taches: Tache[]): void {
    // Génère les 6 derniers mois (du plus ancien au plus récent)
    const now = new Date();
    const months: { key: string; label: string; year: number; month: number }[] = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      months.push({
        key,
        label: `${this.MOIS_LABELS[d.getMonth()]} ${d.getFullYear()}`,
        year: d.getFullYear(),
        month: d.getMonth()
      });
    }

    const stats: MoisStats[] = months.map(m => {
      const tachesDuMois = taches.filter(t => {
        if (!t.dateCreation) return false;
        const dc = new Date(t.dateCreation);
        return dc.getFullYear() === m.year && dc.getMonth() === m.month;
      });

      const total = tachesDuMois.length;
      const terminees = tachesDuMois.filter(t => t.statut === Statut.TERMINE).length;
      const enCours = tachesDuMois.filter(t => t.statut === Statut.EN_COURS).length;
      const aFaire = tachesDuMois.filter(t => t.statut === Statut.A_FAIRE).length;
      const taux = total > 0 ? Math.round((terminees / total) * 100) : 0;

      return { key: m.key, label: m.label, total, terminees, enCours, aFaire, taux };
    });

    this.moisStats.set(stats);
    const max = Math.max(1, ...stats.map(s => s.total));
    this.maxTotalMois.set(max);
  }

  getBarHeight(value: number): number {
    return this.maxTotalMois() > 0 ? (value / this.maxTotalMois()) * 100 : 0;
  }

  getProgressColor(taux: number): string {
    if (taux < 30) return '#EF4444';
    if (taux < 60) return '#F59E0B';
    if (taux < 80) return '#3B82F6';
    return '#22C55E';
  }
}