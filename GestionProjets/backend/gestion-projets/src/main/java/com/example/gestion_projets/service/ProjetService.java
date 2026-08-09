package com.example.gestion_projets.service;

import com.example.gestion_projets.entity.Projet;
import com.example.gestion_projets.repository.ProjetRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProjetService {
    private final ProjetRepository projetRepository;

    public ProjetService(ProjetRepository projetRepository) {
        this.projetRepository = projetRepository;
    }

    public List<Projet> getAllProjets() {
        return projetRepository.findAll();
    }

    public Projet getProjetById(Long id) {
        return projetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Projet non trouvé"));
    }

    public Projet createProjet(Projet projet) {
        projet.setDateCreation(LocalDateTime.now());
        return projetRepository.save(projet);
    }

    public Projet updateProjet(Long id, Projet projetDetails) {
        Projet projet = getProjetById(id);
        projet.setNom(projetDetails.getNom());
        projet.setDescription(projetDetails.getDescription());
        return projetRepository.save(projet);
    }

    public void deleteProjet(Long id) {
        projetRepository.deleteById(id);
    }
}