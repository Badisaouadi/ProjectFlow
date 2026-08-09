# 🚀 Guide de démarrage rapide - Tests Backend

## Prérequis
- MySQL installé et démarré
- Java 17 ou supérieur
- Maven (inclus avec mvnw)

---

## 1️⃣ Créer la base de données

```sql
mysql -u root -p
CREATE DATABASE gestion_projets;
EXIT;
```

---

## 2️⃣ Démarrer le backend

```bash
./mvnw spring-boot:run
```

Le serveur démarre sur : `http://localhost:8082`

---

## 3️⃣ Tests rapides avec curl

### Créer un projet
```bash
curl -X POST http://localhost:8082/api/projets \
  -H "Content-Type: application/json" \
  -d "{\"nom\":\"Projet Test\",\"description\":\"Mon premier projet\"}"
```

### Lister les projets
```bash
curl http://localhost:8082/api/projets
```

### Créer une tâche dans le projet (remplacer {projetId} par l'ID du projet créé)
```bash
curl -X POST http://localhost:8082/api/taches/projet/1 \
  -H "Content-Type: application/json" \
  -d "{\"titre\":\"Tâche 1\",\"description\":\"Ma première tâche\",\"statut\":\"A_FAIRE\",\"priorite\":\"HAUTE\"}"
```

### Lister les tâches
```bash
curl http://localhost:8082/api/taches
```

### Créer une sous-tâche (remplacer {tacheId} par l'ID de la tâche créée)
```bash
curl -X POST http://localhost:8082/api/sous-taches/tache/1 \
  -H "Content-Type: application/json" \
  -d "{\"titre\":\"Sous-tâche 1\",\"description\":\"Ma première sous-tâche\",\"terminee\":false}"
```

### Récupérer les statistiques
```bash
curl http://localhost:8082/api/dashboard/stats/global
```

### Tester les filtres
```bash
# Par statut
curl http://localhost:8082/api/taches/statut/A_FAIRE

# Par priorité
curl http://localhost:8082/api/taches/priorite/HAUTE

# Filtres combinés
curl "http://localhost:8082/api/taches/filtres?statut=A_FAIRE&priorite=HAUTE"
```

### Changer le statut d'une tâche (Kanban drag & drop)
```bash
curl -X PATCH http://localhost:8082/api/taches/1/statut \
  -H "Content-Type: application/json" \
  -d "\"EN_COURS\""
```

---

## 4️⃣ Test avec Postman (recommandé)

### Importer cette collection Postman

Créez un fichier `gestion-projets.postman_collection.json` avec :

```json
{
  "info": {
    "name": "Gestion Projets API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Projets",
      "item": [
        {
          "name": "Créer un projet",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\"nom\":\"Mon Projet\",\"description\":\"Description du projet\"}"
            },
            "url": "http://localhost:8082/api/projets"
          }
        },
        {
          "name": "Lister les projets",
          "request": {
            "method": "GET",
            "url": "http://localhost:8082/api/projets"
          }
        }
      ]
    },
    {
      "name": "Tâches",
      "item": [
        {
          "name": "Créer une tâche",
          "request": {
            "method": "POST",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "{\"titre\":\"Ma tâche\",\"description\":\"Description\",\"statut\":\"A_FAIRE\",\"priorite\":\"HAUTE\"}"
            },
            "url": "http://localhost:8082/api/taches/projet/1"
          }
        },
        {
          "name": "Lister les tâches",
          "request": {
            "method": "GET",
            "url": "http://localhost:8082/api/taches"
          }
        },
        {
          "name": "Changer statut (Kanban)",
          "request": {
            "method": "PATCH",
            "header": [{"key": "Content-Type", "value": "application/json"}],
            "body": {
              "mode": "raw",
              "raw": "\"EN_COURS\""
            },
            "url": "http://localhost:8082/api/taches/1/statut"
          }
        }
      ]
    },
    {
      "name": "Dashboard",
      "item": [
        {
          "name": "Stats globales",
          "request": {
            "method": "GET",
            "url": "http://localhost:8082/api/dashboard/stats/global"
          }
        },
        {
          "name": "Stats derniers 6 mois",
          "request": {
            "method": "GET",
            "url": "http://localhost:8082/api/dashboard/stats/derniers-mois/6"
          }
        }
      ]
    }
  ]
}
```

---

## 5️⃣ Vérifier que tout fonctionne

✅ Si toutes les requêtes ci-dessus fonctionnent, votre backend est opérationnel !

---

## 🐛 Dépannage

### Erreur de connexion MySQL
```
Error: Communications link failure
```
**Solution :** Vérifiez que MySQL est démarré et que la base `gestion_projets` existe

### Port 8082 déjà utilisé
```
Error: Port 8082 is already in use
```
**Solution :** Modifiez le port dans `application.properties`

### Erreur CORS depuis Angular
```
Access-Control-Allow-Origin error
```
**Solution :** Vérifiez que `CorsConfig.java` autorise `http://localhost:4200`

---

## 📞 Support

Pour toute question ou problème, référez-vous à :
- `API_ENDPOINTS.md` - Documentation complète des endpoints
- `COMPLETION_BACKEND.md` - Vue d'ensemble du backend

Bon développement ! 🚀
