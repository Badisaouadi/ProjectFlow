import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Role } from '../../models/utilisateur';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  utilisateur = {
    email: '',
    nom: '',
    prenom: '',
    motDePasse: '',
    confirmMotDePasse: '',
    role: Role.UTILISATEUR,
    actif: true
  };
  loading = signal(false);
  error = signal('');
  success = signal('');

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    // Validation
    if (!this.utilisateur.email || !this.utilisateur.nom || !this.utilisateur.prenom || !this.utilisateur.motDePasse) {
      this.error.set('Veuillez remplir tous les champs');
      return;
    }

    if (this.utilisateur.motDePasse !== this.utilisateur.confirmMotDePasse) {
      this.error.set('Les mots de passe ne correspondent pas');
      return;
    }

    if (this.utilisateur.motDePasse.length < 6) {
      this.error.set('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    this.loading.set(true);
    this.error.set('');
    this.success.set('');

    const { confirmMotDePasse, ...utilisateurData } = this.utilisateur;

    this.authService.register(utilisateurData).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.success.set('Compte créé avec succès ! Redirection...');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.loading.set(false);
        if (err.status === 400) {
          this.error.set('Cet email est déjà utilisé');
        } else {
          this.error.set('Erreur lors de la création du compte');
        }
        console.error('Erreur d\'inscription:', err);
      }
    });
  }
}