export enum Role {
  ADMIN = 'ADMIN',
  UTILISATEUR = 'UTILISATEUR'
}

export interface Utilisateur {
  id?: number;
  email: string;
  nom: string;
  prenom: string;
  motDePasse?: string;
  role: Role;
  actif: boolean;
  dateCreation?: Date;
}

export interface LoginRequest {
  email: string;
  motDePasse: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  utilisateur: Utilisateur;
}