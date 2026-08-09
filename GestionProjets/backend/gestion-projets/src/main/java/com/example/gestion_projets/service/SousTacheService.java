package com.example.gestion_projets.service;

import com.example.gestion_projets.entity.SousTache;
import com.example.gestion_projets.entity.Tache;
import com.example.gestion_projets.repository.SousTacheRepository;
import com.example.gestion_projets.repository.TacheRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SousTacheService {
    private final SousTacheRepository sousTacheRepository;
    private final TacheRepository tacheRepository;

    public SousTacheService(SousTacheRepository sousTacheRepository, TacheRepository tacheRepository) {
        this.sousTacheRepository = sousTacheRepository;
        this.tacheRepository = tacheRepository;
    }

    public List<SousTache> getAllSousTaches() {
        return sousTacheRepository.findAll();
    }

    public List<SousTache> getSousTachesByTache(Long tacheId) {
        return sousTacheRepository.findByTache_Id(tacheId);
    }

    public SousTache getSousTacheById(Long id) {
        return sousTacheRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sous-tâche non trouvée"));
    }

    public SousTache createSousTache(Long tacheId, SousTache sousTache) {
        Tache tache = tacheRepository.findById(tacheId)
                .orElseThrow(() -> new RuntimeException("Tâche non trouvée"));
        sousTache.setTache(tache);
        return sousTacheRepository.save(sousTache);
    }

    public SousTache updateSousTache(Long id, SousTache sousTacheDetails) {
        SousTache sousTache = getSousTacheById(id);
        sousTache.setTitre(sousTacheDetails.getTitre());
        sousTache.setDescription(sousTacheDetails.getDescription());
        sousTache.setTerminee(sousTacheDetails.isTerminee());
        return sousTacheRepository.save(sousTache);
    }

    public void deleteSousTache(Long id) {
        sousTacheRepository.deleteById(id);
    }

    public SousTache toggleSousTache(Long id) {
        SousTache sousTache = getSousTacheById(id);
        sousTache.setTerminee(!sousTache.isTerminee());
        return sousTacheRepository.save(sousTache);
    }
}
