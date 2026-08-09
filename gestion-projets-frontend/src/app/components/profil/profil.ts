import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UtilisateurService } from '../../services/utilisateur.service';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profil.html',
  styleUrls: ['./profil.css']
})
export class ProfilComponent {
  private authService = inject(AuthService);
  private utilisateurService = inject(UtilisateurService);
  
  utilisateur = this.authService.currentUser();
  loading = signal(false);
  success = signal('');
  error = signal('');
  editMode = signal(false);

  onSubmit(): void {
    if (!this.utilisateur) return;
    
    this.loading.set(true);
    this.success.set('');
    this.error.set('');

    this.utilisateurService.update(this.utilisateur.id!, this.utilisateur).subscribe({
      next: (updated) => {
        this.loading.set(false);
        this.success.set('Profil mis à jour avec succès !');
        this.authService.currentUser.set(updated);
        localStorage.setItem('currentUser', JSON.stringify(updated));
        this.editMode.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set('Erreur lors de la mise à jour');
        console.error(err);
      }
    });
  }
}