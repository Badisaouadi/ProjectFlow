import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UtilisateurService } from '../../../services/utilisateur.service';
import { Utilisateur, Role } from '../../../models/utilisateur';

@Component({
  selector: 'app-gestion-utilisateurs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-utilisateurs.html',
  styleUrls: ['./gestion-utilisateurs.css']
})
export class GestionUtilisateurs implements OnInit {
  private utilisateurService = inject(UtilisateurService);

  utilisateurs = signal<Utilisateur[]>([]);
  loading = signal(false);
  showForm = signal(false);
  editingId = signal<number | null>(null);
  roles = Object.values(Role);

  formData: Utilisateur = {
    email: '',
    nom: '',
    prenom: '',
    motDePasse: '',
    role: Role.UTILISATEUR,
    actif: true
  };

  ngOnInit(): void {
    this.loadUtilisateurs();
  }

  loadUtilisateurs(): void {
    this.loading.set(true);
    this.utilisateurService.getAll().subscribe({
      next: (data) => {
        this.utilisateurs.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  openCreateForm(): void {
    this.formData = {
      email: '', nom: '', prenom: '', motDePasse: '',
      role: Role.UTILISATEUR, actif: true
    };
    this.editingId.set(null);
    this.showForm.set(true);
  }

  openEditForm(user: Utilisateur): void {
    this.formData = { ...user, motDePasse: '' };
    this.editingId.set(user.id!);
    this.showForm.set(true);
  }

  cancelForm(): void {
    this.showForm.set(false);
    this.editingId.set(null);
  }

  saveUtilisateur(): void {
    if (!this.formData.email || !this.formData.nom || !this.formData.prenom) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    if (!this.editingId() && !this.formData.motDePasse) {
      alert('Le mot de passe est obligatoire pour un nouvel utilisateur');
      return;
    }

    this.loading.set(true);

    if (this.editingId()) {
      const data: any = { ...this.formData };
      if (!data.motDePasse) delete data.motDePasse;
      this.utilisateurService.update(this.editingId()!, data).subscribe({
        next: () => { this.loadUtilisateurs(); this.cancelForm(); },
        error: () => this.loading.set(false)
      });
    } else {
      this.utilisateurService.create(this.formData).subscribe({
        next: () => { this.loadUtilisateurs(); this.cancelForm(); },
        error: (err) => {
          this.loading.set(false);
          alert(err.status === 400 ? 'Cet email est déjà utilisé' : 'Erreur lors de la création');
        }
      });
    }
  }

  deleteUtilisateur(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      this.utilisateurService.delete(id).subscribe({
        next: () => this.loadUtilisateurs()
      });
    }
  }

  getInitials(user: Utilisateur): string {
    return (user.prenom?.[0] || '') + (user.nom?.[0] || '');
  }
}