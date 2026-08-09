import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TacheService } from '../../../services/tache.service';
import { SousTacheService } from '../../../services/sous-tache.service';
import { Tache, Statut, Priorite, STATUT_LABELS } from '../../../models/tache';
import { SousTache } from '../../../models/sous-tache';

@Component({
  selector: 'app-front-board',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './board.html',
  styleUrls: ['./board.css']
})
export class BoardComponent implements OnInit {
  private tacheService = inject(TacheService);
  private sousTacheService = inject(SousTacheService);

  statuts = [Statut.A_FAIRE, Statut.EN_COURS, Statut.TERMINE];
  statutLabels = STATUT_LABELS;

  taches = signal<Tache[]>([]);
  loading = signal(false);
  error = signal('');
  isDragging = signal(false);

  // Modal
  showModal = signal(false);
  selectedTache = signal<Tache | null>(null);
  sousTaches = signal<SousTache[]>([]);
  loadingSousTaches = signal(false);

  // Nouvelle sous-tâche
  newSousTacheTitre = '';
  showNewSousTacheForm = signal(false);

  ngOnInit(): void {
    this.loadTaches();
  }

  loadTaches(): void {
    this.loading.set(true);
    this.error.set('');
    this.tacheService.getAll().subscribe({
      next: (data) => {
        this.taches.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Erreur lors du chargement des tâches');
        this.loading.set(false);
      }
    });
  }

  getTachesByStatut(statut: Statut): Tache[] {
    return this.taches().filter(t => t.statut === statut);
  }

  getCountByStatut(statut: Statut): number {
    return this.getTachesByStatut(statut).length;
  }

  getPrioriteIcon(priorite: string): string {
    const icons: Record<string, string> = {
      CRITIQUE: '🔴', HAUTE: '🟠', MOYENNE: '🟡', BASSE: '🟢'
    };
    return icons[priorite] || '⚪';
  }

  // ===== DRAG & DROP - CONNECTED LISTS =====
  getConnectedDropLists(): string[] {
    return this.statuts.map(s => s.toString());
  }

  // ===== DRAG & DROP - DROP =====
  drop(event: CdkDragDrop<Tache[]>, newStatut: Statut): void {
    if (event.previousContainer === event.container) {
      return;
    }

    const tache = event.previousContainer.data[event.previousIndex];
    console.log(`🔄 Déplacement de "${tache.titre}" vers ${newStatut}`);

    this.isDragging.set(true);

    const updatedTache = { ...tache, statut: newStatut };
    
    this.tacheService.update(tache.id!, updatedTache).subscribe({
      next: () => {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
        
        const transferredTache = event.container.data[event.currentIndex];
        if (transferredTache) {
          transferredTache.statut = newStatut;
        }
        
        this.isDragging.set(false);
        this.loadTaches();
      },
      error: (err) => {
        console.error('❌ Erreur lors du déplacement:', err);
        this.error.set('Erreur lors du déplacement de la tâche');
        this.isDragging.set(false);
        this.loadTaches();
      }
    });
  }

  // ===== Progression globale =====
  get progressionGlobale(): number {
    const total = this.taches().length;
    if (total === 0) return 0;
    const terminees = this.taches().filter(t => t.statut === Statut.TERMINE).length;
    return Math.round((terminees / total) * 100);
  }

  // ===== Modal =====
  openModal(tache: Tache): void {
    if (this.isDragging()) return;
    this.selectedTache.set(tache);
    this.showModal.set(true);
    this.loadSousTaches(tache.id!);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.selectedTache.set(null);
    this.sousTaches.set([]);
    this.showNewSousTacheForm.set(false);
    this.newSousTacheTitre = '';
  }

  loadSousTaches(tacheId: number): void {
    this.loadingSousTaches.set(true);
    this.sousTacheService.getByTache(tacheId).subscribe({
      next: (data) => {
        this.sousTaches.set(data);
        this.loadingSousTaches.set(false);
      },
      error: () => this.loadingSousTaches.set(false)
    });
  }

  toggleSousTache(sousTache: SousTache): void {
    this.sousTacheService.toggle(sousTache.id!).subscribe({
      next: () => {
        const tache = this.selectedTache();
        if (tache) this.loadSousTaches(tache.id!);
      }
    });
  }

  addSousTache(): void {
    const tache = this.selectedTache();
    if (!tache || !this.newSousTacheTitre.trim()) return;

    const nouvelle: SousTache = {
      titre: this.newSousTacheTitre.trim(),
      description: '',
      terminee: false
    };

    this.sousTacheService.create(tache.id!, nouvelle).subscribe({
      next: () => {
        this.newSousTacheTitre = '';
        this.showNewSousTacheForm.set(false);
        this.loadSousTaches(tache.id!);
      }
    });
  }

  deleteSousTache(id: number): void {
    if (!confirm('Supprimer cette sous-tâche ?')) return;
    const tache = this.selectedTache();
    this.sousTacheService.delete(id).subscribe({
      next: () => {
        if (tache) this.loadSousTaches(tache.id!);
      }
    });
  }

  getSousTacheProgress(): number {
    const total = this.sousTaches().length;
    if (total === 0) return 0;
    const terminees = this.sousTaches().filter(s => s.terminee).length;
    return Math.round((terminees / total) * 100);
  }

  // ===== Animation =====
  onDragStarted(): void {
    this.isDragging.set(true);
  }

  onDragEnded(): void {
    setTimeout(() => {
      this.isDragging.set(false);
    }, 300);
  }
}