package com.example.gestion_projets.repository;

import com.example.gestion_projets.entity.Tache;
import com.example.gestion_projets.entity.Statut;
import com.example.gestion_projets.entity.Priorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TacheRepository extends JpaRepository<Tache, Long> {
    List<Tache> findByProjet_Id(Long projetId);   // ✅ renommé
    List<Tache> findByStatut(Statut statut);
    List<Tache> findByPriorite(Priorite priorite);
    List<Tache> findByDateCreationBetween(LocalDateTime debut, LocalDateTime fin);
    List<Tache> findByDateEcheanceBetween(LocalDateTime debut, LocalDateTime fin);

    long countByStatut(Statut statut);
    long countByStatutAndDateCreationBetween(Statut statut, LocalDateTime debut, LocalDateTime fin);

    @Query("SELECT t FROM Tache t WHERE " +
            "(:projetId IS NULL OR t.projet.id = :projetId) AND " +
            "(:statut IS NULL OR t.statut = :statut) AND " +
            "(:priorite IS NULL OR t.priorite = :priorite)")
    List<Tache> findByFilters(@Param("projetId") Long projetId,
                              @Param("statut") Statut statut,
                              @Param("priorite") Priorite priorite);
}