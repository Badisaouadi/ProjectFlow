package com.example.gestion_projets.controller;

import com.example.gestion_projets.entity.SousTache;
import com.example.gestion_projets.service.SousTacheService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/sous-taches")
@CrossOrigin(origins = "http://localhost:4200")
public class SousTacheController {
    private final SousTacheService sousTacheService;

    public SousTacheController(SousTacheService sousTacheService) {
        this.sousTacheService = sousTacheService;
    }

    @GetMapping
    public List<SousTache> getAllSousTaches() {
        return sousTacheService.getAllSousTaches();
    }

    @GetMapping("/tache/{tacheId}")
    public List<SousTache> getSousTachesByTache(@PathVariable Long tacheId) {
        return sousTacheService.getSousTachesByTache(tacheId);
    }

    @GetMapping("/{id}")
    public SousTache getSousTacheById(@PathVariable Long id) {
        return sousTacheService.getSousTacheById(id);
    }

    @PostMapping("/tache/{tacheId}")
    public SousTache createSousTache(@PathVariable Long tacheId, @RequestBody SousTache sousTache) {
        return sousTacheService.createSousTache(tacheId, sousTache);
    }

    @PutMapping("/{id}")
    public SousTache updateSousTache(@PathVariable Long id, @RequestBody SousTache sousTache) {
        return sousTacheService.updateSousTache(id, sousTache);
    }

    @PatchMapping("/{id}/toggle")
    public SousTache toggleSousTache(@PathVariable Long id) {
        return sousTacheService.toggleSousTache(id);
    }

    @DeleteMapping("/{id}")
    public void deleteSousTache(@PathVariable Long id) {
        sousTacheService.deleteSousTache(id);
    }
}
