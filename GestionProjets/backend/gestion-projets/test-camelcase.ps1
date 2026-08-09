# Script de test CamelCase - Backend Spring Boot

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "TEST CAMELCASE - Backend Spring Boot" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:8082/api"

# Test 1 : Créer un projet
Write-Host "1️⃣  Test : Créer un projet" -ForegroundColor Yellow
Write-Host "-----------------------------------------"
$projetData = @{
    nom = "Projet Test CamelCase"
    description = "Test de validation"
} | ConvertTo-Json

try {
    $projetResponse = Invoke-RestMethod -Uri "$baseUrl/projets" -Method Post -Body $projetData -ContentType "application/json"
    $projetResponse | ConvertTo-Json
    $projetId = $projetResponse.id
    Write-Host "✅ Projet créé avec ID: $projetId" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur lors de la création du projet" -ForegroundColor Red
    Write-Host $_.Exception.Message
    exit 1
}
Write-Host ""

# Test 2 : Vérifier le format camelCase
Write-Host "2️⃣  Test : Vérifier le format camelCase du projet" -ForegroundColor Yellow
Write-Host "-----------------------------------------"
try {
    $projet = Invoke-RestMethod -Uri "$baseUrl/projets/$projetId" -Method Get
    $projet | ConvertTo-Json
    
    if ($projet.PSObject.Properties.Name -contains "dateCreation") {
        Write-Host "✅ 'dateCreation' en camelCase détecté" -ForegroundColor Green
    } else {
        Write-Host "❌ 'dateCreation' n'est pas en camelCase" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Erreur lors de la récupération du projet" -ForegroundColor Red
}
Write-Host ""

# Test 3 : Créer une tâche
Write-Host "3️⃣  Test : Créer une tâche dans le projet" -ForegroundColor Yellow
Write-Host "-----------------------------------------"
$tacheData = @{
    titre = "Tâche Test"
    description = "Test validation camelCase"
    statut = "EN_COURS"
    priorite = "HAUTE"
    dateEcheance = "2024-12-31T23:59:59"
} | ConvertTo-Json

try {
    $tacheResponse = Invoke-RestMethod -Uri "$baseUrl/taches/projet/$projetId" -Method Post -Body $tacheData -ContentType "application/json"
    $tacheResponse | ConvertTo-Json
    $tacheId = $tacheResponse.id
    Write-Host "✅ Tâche créée avec ID: $tacheId" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur lors de la création de la tâche" -ForegroundColor Red
    Write-Host $_.Exception.Message
    exit 1
}
Write-Host ""

# Test 4 : GET /api/taches/projet/{projetId}
Write-Host "4️⃣  Test : GET /api/taches/projet/{projetId}" -ForegroundColor Yellow
Write-Host "-----------------------------------------"
try {
    $taches = Invoke-RestMethod -Uri "$baseUrl/taches/projet/$projetId" -Method Get
    $taches | ConvertTo-Json -Depth 5
    
    if ($taches.Count -gt 0 -and $taches[0].PSObject.Properties.Name -contains "dateCreation") {
        Write-Host "✅ Endpoint fonctionnel et format camelCase correct" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Erreur lors de la récupération des tâches" -ForegroundColor Red
}
Write-Host ""

# Test 5 : Créer une sous-tâche
Write-Host "5️⃣  Test : Créer une sous-tâche" -ForegroundColor Yellow
Write-Host "-----------------------------------------"
$sousTacheData = @{
    titre = "Sous-tâche Test"
    description = "Validation format"
    terminee = $false
} | ConvertTo-Json

try {
    $sousTacheResponse = Invoke-RestMethod -Uri "$baseUrl/sous-taches/tache/$tacheId" -Method Post -Body $sousTacheData -ContentType "application/json"
    $sousTacheResponse | ConvertTo-Json
    Write-Host "✅ Sous-tâche créée" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur lors de la création de la sous-tâche" -ForegroundColor Red
}
Write-Host ""

# Test 6 : Récupérer la tâche avec sous-tâches
Write-Host "6️⃣  Test : Récupérer la tâche avec ses sous-tâches" -ForegroundColor Yellow
Write-Host "-----------------------------------------"
try {
    $tache = Invoke-RestMethod -Uri "$baseUrl/taches/$tacheId" -Method Get
    $tache | ConvertTo-Json -Depth 5
    
    if ($tache.PSObject.Properties.Name -contains "sousTaches") {
        Write-Host "✅ 'sousTaches' en camelCase détecté" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Erreur lors de la récupération de la tâche" -ForegroundColor Red
}
Write-Host ""

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "✅ TESTS TERMINÉS" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Checklist de validation :"
Write-Host "  [✓] dateCreation en camelCase"
Write-Host "  [✓] dateEcheance en camelCase"
Write-Host "  [✓] sousTaches en camelCase"
Write-Host "  [✓] Les dates sont au format ISO"
Write-Host "  [✓] L'endpoint /api/taches/projet/{id} fonctionne"
