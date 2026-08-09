import { Tache } from './tache';

export interface Projet {
  id?: number;
  nom: string;
  description: string;
  dateCreation?: Date;
  taches?: Tache[];
}