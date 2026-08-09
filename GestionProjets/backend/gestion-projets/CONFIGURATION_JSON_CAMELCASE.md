# ✅ Configuration JSON - CamelCase

## 🎯 Objectif

Configurer Spring Boot pour renvoyer automatiquement les données JSON en **camelCase** au lieu de snake_case.

---

## ⚙️ Configuration appliquée

### 1. **application.properties**
```properties
# Jackson Configuration - Force camelCase
spring.jackson.property-naming-strategy=LOWER_CAMEL_CASE
spring.jackson.serialization.write-dates-as-timestamps=false
```

### 2. **pom.xml** (dépendances corrigées)
```xml
<!-- Inclut Jackson automatiquement -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

---

## 📊 Format de réponse attendu

### ❌ AVANT (snake_case)
```json
{
  "id": 1,
  "titre": "Ma tâche",
  "date_creation": "2024-01-15T10:30:00",
  "date_echeance": "2024-12-31T23:59:59",
  "projet_id": 5
}
```

### ✅ APRÈS (camelCase)
```json
{
  "id": 1,
  "titre": "Ma tâche",
  "dateCreation": "2024-01-15T10:30:00",
  "dateEcheance": "2024-12-31T23:59:59",
  "projetId": 5
}
```

---

## 🧪 Tests de validation

### Test 1 : Endpoint GET /api/taches/projet/{projetId}

#### Commande curl
```bash
curl -X GET http://localhost:8082/api/taches/projet/1 -H "Accept: application/json"
```

#### Réponse attendue (camelCase)
```json
[
  {
    "id": 1,
    "titre": "Développement API",
    "description": "Créer les endpoints REST",
    "statut": "EN_COURS",
    "priorite": "HAUTE",
    "dateCreation": "2024-01-15T10:30:00",
    "dateEcheance": "2024-12-31T23:59:59",
    "sousTaches": [
      {
        "id": 1,
        "titre": "Créer endpoints",
        "description": "...",
        "terminee": false
      }
    ]
  }
]
```

### Test 2 : Endpoint GET /api/projets

#### Commande curl
```bash
curl -X GET http://localhost:8082/api/projets -H "Accept: application/json"
```

#### Réponse attendue (camelCase)
```json
[
  {
    "id": 1,
    "nom": "Mon Projet",
    "description": "Description du projet",
    "dateCreation": "2024-01-10T09:00:00",
    "taches": [
      {
        "id": 1,
        "titre": "Tâche 1",
        "statut": "A_FAIRE",
        "priorite": "MOYENNE",
        "dateCreation": "2024-01-15T10:30:00",
        "dateEcheance": "2024-12-31T23:59:59"
      }
    ]
  }
]
```

### Test 3 : POST avec camelCase

#### Commande curl
```bash
curl -X POST http://localhost:8082/api/taches/projet/1 \
  -H "Content-Type: application/json" \
  -d '{
    "titre": "Nouvelle tâche",
    "description": "Description",
    "statut": "A_FAIRE",
    "priorite": "HAUTE",
    "dateEcheance": "2024-12-31T23:59:59"
  }'
```

#### Réponse attendue (camelCase)
```json
{
  "id": 2,
  "titre": "Nouvelle tâche",
  "description": "Description",
  "statut": "A_FAIRE",
  "priorite": "HAUTE",
  "dateCreation": "2024-01-20T14:25:00",
  "dateEcheance": "2024-12-31T23:59:59"
}
```

---

## 🔍 Vérification de l'endpoint GET /api/taches/projet/{projetId}

### Configuration de l'endpoint

**Controller** : `TacheController.java`
```java
@GetMapping("/projet/{projetId}")
public List<Tache> getTachesByProjet(@PathVariable Long projetId) {
    return tacheService.getTachesByProjet(projetId);
}
```

**Service** : `TacheService.java`
```java
public List<Tache> getTachesByProjet(Long projetId) {
    return tacheRepository.findByProjetId(projetId);
}
```

**Repository** : `TacheRepository.java`
```java
List<Tache> findByProjetId(Long projetId);
```

### ✅ Vérifications effectuées
- [x] Endpoint correctement mappé : `GET /api/taches/projet/{projetId}`
- [x] PathVariable `projetId` correctement nommé
- [x] Service correctement implémenté
- [x] Repository Spring Data JPA correctement configuré
- [x] Jackson configuré pour camelCase

---

## 📝 Scénario de test complet

### Étape 1 : Démarrer le backend
```bash
./mvnw spring-boot:run
```

### Étape 2 : Créer un projet
```bash
curl -X POST http://localhost:8082/api/projets \
  -H "Content-Type: application/json" \
  -d '{"nom":"Projet Test","description":"Mon premier projet"}'
```

**Réponse** : Notez l'ID du projet (ex: `"id": 1`)

### Étape 3 : Créer une tâche dans le projet
```bash
curl -X POST http://localhost:8082/api/taches/projet/1 \
  -H "Content-Type: application/json" \
  -d '{
    "titre":"Tâche Test",
    "description":"Ma première tâche",
    "statut":"A_FAIRE",
    "priorite":"HAUTE",
    "dateEcheance":"2024-12-31T23:59:59"
  }'
```

### Étape 4 : Récupérer les tâches du projet
```bash
curl -X GET http://localhost:8082/api/taches/projet/1
```

**Vérifications** :
- ✅ Les propriétés sont en camelCase (`dateCreation`, `dateEcheance`)
- ✅ La liste des tâches est retournée
- ✅ Les sous-tâches sont incluses (si elles existent)

---

## 🎨 Intégration avec Angular

Votre frontend Angular peut maintenant utiliser directement ces interfaces :

```typescript
// models/tache.model.ts
export interface Tache {
  id: number;
  titre: string;
  description: string;
  statut: 'A_FAIRE' | 'EN_COURS' | 'TERMINE';
  priorite: 'BASSE' | 'MOYENNE' | 'HAUTE' | 'CRITIQUE';
  dateCreation: Date;
  dateEcheance: Date;
  sousTaches?: SousTache[];
}

// service/tache.service.ts
getTachesByProjet(projetId: number): Observable<Tache[]> {
  return this.http.get<Tache[]>(`${this.apiUrl}/taches/projet/${projetId}`);
}
```

**Avantages** :
- ✅ Pas de transformation nécessaire
- ✅ Typage TypeScript cohérent
- ✅ Code plus lisible et maintenable

---

## 🐛 Dépannage

### Problème 1 : Les champs sont toujours en snake_case
**Solution** : Vérifiez que la configuration dans `application.properties` est bien présente et redémarrez le serveur.

### Problème 2 : Erreur 404 sur l'endpoint
**Vérification** :
```bash
# Vérifier que le serveur est sur le bon port
curl http://localhost:8082/api/taches

# Vérifier avec un ID existant
curl http://localhost:8082/api/taches/projet/1
```

### Problème 3 : Liste vide []
**Cause** : Aucune tâche n'existe pour ce projet
**Solution** : Créez d'abord une tâche avec `POST /api/taches/projet/{projetId}`

---

## ✅ Résumé

| Configuration | Status |
|---------------|--------|
| Jackson camelCase | ✅ Configuré |
| Format dates ISO | ✅ Configuré |
| Endpoint GET /api/taches/projet/{id} | ✅ Fonctionnel |
| Dépendances Maven | ✅ Corrigées |
| Compilation | ✅ SUCCESS |

**Le backend est maintenant 100% compatible avec votre frontend Angular !** 🚀
