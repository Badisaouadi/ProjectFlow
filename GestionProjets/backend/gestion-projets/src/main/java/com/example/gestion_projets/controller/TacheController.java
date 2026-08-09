package com.example.gestion_projets.controller;

import com.example.gestion_projets.entity.Tache;
import com.example.gestion_projets.entity.Statut;
import com.example.gestion_projets.entity.Priorite;
import com.example.gestion_projets.service.TacheService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/taches")
@CrossOrigin(origins = "http://localhost:4200")
public class TacheController {
    private final TacheService tacheService;

    public TacheController(TacheService tacheService) {
        this.tacheService = tacheService;
    }

    @GetMapping
    public List<Tache> getAllTaches() {
        return tacheService.getAllTaches();
    }

    @GetMapping("/projet/{projetId}")
    public List<Tache> getTachesByProjet(@PathVariable Long projetId) {
        return tacheService.getTachesByProjet(projetId);
    }

    @GetMapping("/statut/{statut}")
    public List<Tache> getTachesByStatut(@PathVariable Statut statut) {
        return tacheService.getTachesByStatut(statut);
    }

    @GetMapping("/priorite/{priorite}")
    public List<Tache> getTachesByPriorite(@PathVariable Priorite priorite) {
        return tacheService.getTachesByPriorite(priorite);
    }

    @GetMapping("/date-creation")
    public List<Tache> getTachesByDateCreation(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime debut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin) {
        return tacheService.getTachesByDateCreation(debut, fin);
    }

    @GetMapping("/date-echeance")
    public List<Tache> getTachesByDateEcheance(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime debut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin) {
        return tacheService.getTachesByDateEcheance(debut, fin);
    }

    @GetMapping("/filtres")
    public List<Tache> getTachesByFilters(
            @RequestParam(required = false) Long projetId,
            @RequestParam(required = false) Statut statut,
            @RequestParam(required = false) Priorite priorite) {
        return tacheService.getTachesByFilters(projetId, statut, priorite);
    }

    @GetMapping("/{id}")
    public Tache getTacheById(@PathVariable Long id) {
        return tacheService.getTacheById(id);
    }

    @PostMapping("/projet/{projetId}")
    public Tache createTache(@PathVariable Long projetId, @RequestBody Tache tache) {
        return tacheService.createTache(projetId, tache);
    }

    @PutMapping("/{id}")
    public Tache updateTache(@PathVariable Long id, @RequestBody Tache tache) {
        return tacheService.updateTache(id, tache);
    }

    @PatchMapping("/{id}/statut")
    public Tache updateTacheStatut(@PathVariable Long id, @RequestBody Statut statut) {
        return tacheService.updateTacheStatut(id, statut);
    }

    @DeleteMapping("/{id}")
    public void deleteTache(@PathVariable Long id) {
        tacheService.deleteTache(id);
    }
}