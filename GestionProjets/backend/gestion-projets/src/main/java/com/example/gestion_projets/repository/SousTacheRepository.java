package com.example.gestion_projets.repository;

import com.example.gestion_projets.entity.SousTache;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SousTacheRepository extends JpaRepository<SousTache, Long> {
    List<SousTache> findByTache_Id(Long tacheId);
}