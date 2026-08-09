# Documentation API - Gestion de Projets

## Base URL
```
http://localhost:8080/api
```

---

## 📁 Projets

### Récupérer tous les projets
```http
GET /api/projets
```

### Récupérer un projet par ID
```http
GET /api/projets/{id}
```

### Créer un projet
```http
POST /api/projets
Content-Type: application/json

{
  "nom": "Mon Projet",
  "description": "Description du projet"
}
```

### Modifier un projet
```http
PUT /api/projets/{id}
Content-Type: application/json

{
  "nom": "Nouveau nom",
  "description": "Nouvelle description"
}
```

### Supprimer un projet
```http
DELETE /api/projets/{id}
```

---

## ✅ Tâches

### Récupérer toutes les tâches
```http
GET /api/taches
```

### Récupérer une tâche par ID
```http
GET /api/taches/{id}
```

### Récupérer les tâches par projet
```http
GET /api/taches/projet/{projetId}
```

### Récupérer les tâches par statut
```http
GET /api/taches/statut/{statut}
```
Statuts possibles : `A_FAIRE`, `EN_COURS`, `TERMINE`

### Récupérer les tâches par priorité
```http
GET /api/taches/priorite/{priorite}
```
Priorités possibles : `BASSE`, `MOYENNE`, `HAUTE`, `CRITIQUE`

### Récupérer les tâches par date de création
```http
GET /api/taches/date-creation?debut=2024-01-01T00:00:00&fin=2024-12-31T23:59:59
```

### Récupérer les tâches par date d'échéance
```http
GET /api/taches/date-echeance?debut=2024-01-01T00:00:00&fin=2024-12-31T23:59:59
```

### Récupérer les tâches avec filtres combinés
```http
GET /api/taches/filtres?projetId=1&statut=EN_COURS&priorite=HAUTE
```
Tous les paramètres sont optionnels et peuvent être combinés.

### Créer une tâche
```http
POST /api/taches/projet/{projetId}
Content-Type: application/json

{
  "titre": "Ma tâche",
  "description": "Description de la tâche",
  "statut": "A_FAIRE",
  "priorite": "HAUTE",
  "dateEcheance": "2024-12-31T23:59:59"
}
```

### Modifier une tâche
```http
PUT /api/taches/{id}
Content-Type: application/json

{
  "titre": "Nouveau titre",
  "description": "Nouvelle description",
  "statut": "EN_COURS",
  "priorite": "MOYENNE",
  "dateEcheance": "2024-12-31T23:59:59"
}
```

### Modifier uniquement le statut d'une tâche (pour Kanban drag & drop)
```http
PATCH /api/taches/{id}/statut
Content-Type: application/json

"EN_COURS"
```

### Supprimer une tâche
```http
DELETE /api/taches/{id}
```

---

## 📋 Sous-tâches

### Récupérer toutes les sous-tâches
```http
GET /api/sous-taches
```

### Récupérer une sous-tâche par ID
```http
GET /api/sous-taches/{id}
```

### Récupérer les sous-tâches d'une tâche
```http
GET /api/sous-taches/tache/{tacheId}
```

### Créer une sous-tâche
```http
POST /api/sous-taches/tache/{tacheId}
Content-Type: application/json

{
  "titre": "Ma sous-tâche",
  "description": "Description",
  "terminee": false
}
```

### Modifier une sous-tâche
```http
PUT /api/sous-taches/{id}
Content-Type: application/json

{
  "titre": "Nouveau titre",
  "description": "Nouvelle description",
  "terminee": true
}
```

### Basculer l'état terminé/non terminé d'une sous-tâche
```http
PATCH /api/sous-taches/{id}/toggle
```

### Supprimer une sous-tâche
```http
DELETE /api/sous-taches/{id}
```

---

## 📊 Dashboard (Statistiques)

### Récupérer les statistiques globales
```http
GET /api/dashboard/stats/global
```

Réponse :
```json
{
  "annee": 2024,
  "mois": 1,
  "tachesTerminees": 10,
  "tachesEnCours": 5,
  "tachesAFaire": 3,
  "totalTaches": 18,
  "tauxAvancement": 55.56
}
```

### Récupérer les statistiques d'un mois spécifique
```http
GET /api/dashboard/stats/mois/{annee}/{mois}
```

Exemple :
```http
GET /api/dashboard/stats/mois/2024/1
```

### Récupérer les statistiques des N derniers mois
```http
GET /api/dashboard/stats/derniers-mois/{nombreMois}
```

Exemple (6 derniers mois) :
```http
GET /api/dashboard/stats/derniers-mois/6
```

Réponse :
```json
[
  {
    "annee": 2024,
    "mois": 1,
    "tachesTerminees": 10,
    "tachesEnCours": 5,
    "tachesAFaire": 3,
    "totalTaches": 18,
    "tauxAvancement": 55.56
  },
  ...
]
```

---

## 📝 Notes importantes

1. **CORS** : Le backend autorise les requêtes depuis `http://localhost:4200` (Angular)

2. **Format des dates** : Utiliser le format ISO 8601 : `YYYY-MM-DDTHH:mm:ss`

3. **Relations** :
   - Un **Projet** contient plusieurs **Tâches**
   - Une **Tâche** contient plusieurs **Sous-tâches**

4. **Cascade** : La suppression d'un projet supprime automatiquement ses tâches et sous-tâches

5. **Statuts par défaut** : Si aucun statut n'est spécifié lors de la création d'une tâche, `A_FAIRE` est utilisé par défaut

---

## 🎯 Cas d'usage par fonctionnalité

### Interface Liste (avec filtres)
- `GET /api/projets` - Afficher tous les projets
- `GET /api/taches/filtres?projetId=X&statut=Y&priorite=Z` - Filtrer les tâches
- `GET /api/sous-taches/tache/{tacheId}` - Afficher les sous-tâches

### Interface Board (Kanban)
- `GET /api/taches/statut/A_FAIRE` - Colonne "À faire"
- `GET /api/taches/statut/EN_COURS` - Colonne "En cours"
- `GET /api/taches/statut/TERMINE` - Colonne "Terminé"
- `PATCH /api/taches/{id}/statut` - Déplacer une carte (drag & drop)

### Mini Dashboard
- `GET /api/dashboard/stats/global` - Vue d'ensemble
- `GET /api/dashboard/stats/derniers-mois/6` - Graphiques mensuels
