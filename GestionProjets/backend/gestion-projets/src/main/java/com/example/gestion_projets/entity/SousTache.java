package com.example.gestion_projets.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SousTache {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre;
    private String description;
    private boolean terminee;

    @ManyToOne
    @JoinColumn(name = "tache_id")
    @JsonBackReference
    private Tache tache;

    @JsonProperty("tacheId")
    public Long getTacheId() {
        return tache != null ? tache.getId() : null;
    }

    @JsonProperty("tacheTitre")
    public String getTacheTitre() {
        return tache != null ? tache.getTitre() : null;
    }
}