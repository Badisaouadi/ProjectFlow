#!/bin/bash

echo "========================================="
echo "TEST CAMELCASE - Backend Spring Boot"
echo "========================================="
echo ""

BASE_URL="http://localhost:8082/api"

echo "1️⃣  Test : Créer un projet"
echo "-----------------------------------------"
PROJET_RESPONSE=$(curl -s -X POST "$BASE_URL/projets" \
  -H "Content-Type: application/json" \
  -d '{"nom":"Projet Test CamelCase","description":"Test de validation"}')
echo "$PROJET_RESPONSE" | jq '.'
PROJET_ID=$(echo "$PROJET_RESPONSE" | jq -r '.id')
echo "✅ Projet créé avec ID: $PROJET_ID"
echo ""

echo "2️⃣  Test : Vérifier le format camelCase du projet"
echo "-----------------------------------------"
curl -s "$BASE_URL/projets/$PROJET_ID" | jq '.'
echo "🔍 Vérifiez que 'dateCreation' est en camelCase (pas 'date_creation')"
echo ""

echo "3️⃣  Test : Créer une tâche dans le projet"
echo "-----------------------------------------"
TACHE_RESPONSE=$(curl -s -X POST "$BASE_URL/taches/projet/$PROJET_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "titre":"Tâche Test",
    "description":"Test validation camelCase",
    "statut":"EN_COURS",
    "priorite":"HAUTE",
    "dateEcheance":"2024-12-31T23:59:59"
  }')
echo "$TACHE_RESPONSE" | jq '.'
TACHE_ID=$(echo "$TACHE_RESPONSE" | jq -r '.id')
echo "✅ Tâche créée avec ID: $TACHE_ID"
echo ""

echo "4️⃣  Test : GET /api/taches/projet/{projetId}"
echo "-----------------------------------------"
curl -s "$BASE_URL/taches/projet/$PROJET_ID" | jq '.'
echo "🔍 Vérifiez les champs camelCase :"
echo "   - dateCreation (pas date_creation)"
echo "   - dateEcheance (pas date_echeance)"
echo ""

echo "5️⃣  Test : Créer une sous-tâche"
echo "-----------------------------------------"
SOUS_TACHE_RESPONSE=$(curl -s -X POST "$BASE_URL/sous-taches/tache/$TACHE_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "titre":"Sous-tâche Test",
    "description":"Validation format",
    "terminee":false
  }')
echo "$SOUS_TACHE_RESPONSE" | jq '.'
echo ""

echo "6️⃣  Test : Récupérer la tâche avec ses sous-tâches"
echo "-----------------------------------------"
curl -s "$BASE_URL/taches/$TACHE_ID" | jq '.'
echo "🔍 Vérifiez que 'sousTaches' contient la sous-tâche"
echo ""

echo "========================================="
echo "✅ TESTS TERMINÉS"
echo "========================================="
echo ""
echo "📋 Checklist de validation :"
echo "  [ ] dateCreation en camelCase"
echo "  [ ] dateEcheance en camelCase"
echo "  [ ] sousTaches en camelCase"
echo "  [ ] Les dates sont au format ISO (pas timestamp)"
echo "  [ ] L'endpoint /api/taches/projet/{id} fonctionne"
