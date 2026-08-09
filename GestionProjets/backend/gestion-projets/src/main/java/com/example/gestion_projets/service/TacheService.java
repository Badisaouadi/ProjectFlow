package com.example.gestion_projets.service;

import com.example.gestion_projets.entity.Tache;
import com.example.gestion_projets.entity.Projet;
import com.example.gestion_projets.entity.Statut;
import com.example.gestion_projets.entity.Priorite;
import com.example.gestion_projets.repository.TacheRepository;
import com.example.gestion_projets.repository.ProjetRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TacheService {
    private final TacheRepository tacheRepository;
    private final ProjetRepository projetRepository;

    public TacheService(TacheRepository tacheRepository, ProjetRepository projetRepository) {
        this.tacheRepository = tacheRepository;
        this.projetRepository = projetRepository;
    }

    public List<Tache> getAllTaches() {
        return tacheRepository.findAll();
    }

    public Tache getTacheById(Long id) {
        return tacheRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tâche non trouvée"));
    }

    public List<Tache> getTachesByProjet(Long projetId) {
        return tacheRepository.findByProjet_Id(projetId);
    }

    public List<Tache> getTachesByStatut(Statut statut) {
        return tacheRepository.findByStatut(statut);
    }

    public List<Tache> getTachesByPriorite(Priorite priorite) {
        return tacheRepository.findByPriorite(priorite);
    }

    public List<Tache> getTachesByDateCreation(LocalDateTime debut, LocalDateTime fin) {
        return tacheRepository.findByDateCreationBetween(debut, fin);
    }

    public List<Tache> getTachesByDateEcheance(LocalDateTime debut, LocalDateTime fin) {
        return tacheRepository.findByDateEcheanceBetween(debut, fin);
    }

    public List<Tache> getTachesByFilters(Long projetId, Statut statut, Priorite priorite) {
        return tacheRepository.findByFilters(projetId, statut, priorite);
    }

    public Tache createTache(Long projetId, Tache tache) {
        Projet projet = projetRepository.findById(projetId)
                .orElseThrow(() -> new RuntimeException("Projet non trouvé"));
        tache.setProjet(projet);
        tache.setDateCreation(LocalDateTime.now());
        if (tache.getStatut() == null) {
            tache.setStatut(Statut.A_FAIRE);
        }
        return tacheRepository.save(tache);
    }

    public Tache updateTache(Long id, Tache tacheDetails) {
        Tache tache = getTacheById(id);
        tache.setTitre(tacheDetails.getTitre());
        tache.setDescription(tacheDetails.getDescription());
        tache.setStatut(tacheDetails.getStatut());
        tache.setPriorite(tacheDetails.getPriorite());
        tache.setDateEcheance(tacheDetails.getDateEcheance());
        return tacheRepository.save(tache);
    }

    public Tache updateTacheStatut(Long id, Statut statut) {
        Tache tache = getTacheById(id);
        tache.setStatut(statut);
        return tacheRepository.save(tache);
    }

    public void deleteTache(Long id) {
        tacheRepository.deleteById(id);
    }
}