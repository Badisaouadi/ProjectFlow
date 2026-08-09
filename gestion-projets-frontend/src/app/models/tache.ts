import { SousTache } from './sous-tache';

export enum Statut {
  A_FAIRE = 'A_FAIRE',
  EN_COURS = 'EN_COURS',
  TERMINE = 'TERMINE'
}

export enum Priorite {
  BASSE = 'BASSE',
  MOYENNE = 'MOYENNE',
  HAUTE = 'HAUTE',
  CRITIQUE = 'CRITIQUE'
}

export interface Tache {
  id?: number;
  titre: string;
  description: string;
  statut: Statut;
  priorite: Priorite;
  dateCreation?: Date;
  dateEcheance?: Date;
  projetId?: number;
  sousTaches?: SousTache[];
}

export const STATUT_LABELS: Record<Statut, string> = {
  [Statut.A_FAIRE]: 'À faire',
  [Statut.EN_COURS]: 'En cours',
  [Statut.TERMINE]: 'Terminé'
};

export const STATUT_ORDRE: Record<Statut, number> = {
  [Statut.A_FAIRE]: 0,
  [Statut.EN_COURS]: 1,
  [Statut.TERMINE]: 2
};