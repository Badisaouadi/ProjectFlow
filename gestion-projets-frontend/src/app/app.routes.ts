import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './guards/auth.guard';

// Auth
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';

// FrontOffice
import { LayoutComponent as FrontofficeLayoutComponent } from './components/frontoffice/layout/layout';
import { ProjetsComponent } from './components/frontoffice/projets/projets';
import { BoardComponent as FrontBoardComponent } from './components/frontoffice/board/board';
import { DashboardComponent as FrontDashboardComponent } from './components/frontoffice/dashboard/dashboard';

// BackOffice
import { LayoutComponent as BackofficeLayoutComponent } from './components/backoffice/layout/layout';
import { AdminDashboardComponent } from './components/backoffice/admin-dashboard/admin-dashboard';
import { GestionProjetsComponent } from './components/backoffice/gestion-projets/gestion-projets';
import { ProjetFormComponent } from './components/backoffice/projet-form/projet-form';
import { GestionTachesComponent } from './components/backoffice/gestion-taches/gestion-taches';
import { TacheFormComponent } from './components/backoffice/tache-form/tache-form';
import { GestionSousTachesComponent } from './components/backoffice/gestion-sous-taches/gestion-sous-taches';
import { GestionUtilisateurs } from './components/backoffice/gestion-utilisateurs/gestion-utilisateurs';
import { StatistiquesComponent } from './components/backoffice/statistiques/statistiques';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // FrontOffice
  {
    path: '',
    component: FrontofficeLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'fo/projets', pathMatch: 'full' },
      { path: 'fo/projets', component: ProjetsComponent },
      { path: 'fo/board', component: FrontBoardComponent },
      { path: 'fo/dashboard', component: FrontDashboardComponent }
    ]
  },

  // BackOffice
  {
    path: 'admin',
    component: BackofficeLayoutComponent,
    canActivate: [adminGuard],
    children: [
      { path: '', component: AdminDashboardComponent },

      { path: 'projets', component: GestionProjetsComponent },
      { path: 'projets/new', component: ProjetFormComponent },
      { path: 'projets/edit/:id', component: ProjetFormComponent },

      { path: 'taches', component: GestionTachesComponent },
      { path: 'taches/new', component: TacheFormComponent },
      { path: 'taches/edit/:id', component: TacheFormComponent },

      { path: 'sous-taches', component: GestionSousTachesComponent },
      { path: 'utilisateurs', component: GestionUtilisateurs },
      { path: 'statistiques', component: StatistiquesComponent }
    ]
  },

  { path: '**', redirectTo: 'fo/projets' }
];