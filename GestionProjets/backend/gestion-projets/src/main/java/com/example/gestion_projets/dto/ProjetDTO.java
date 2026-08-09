package com.example.gestion_projets.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjetDTO {
    private Long id;
    private String nom;
    private String description;
    private LocalDateTime dateCreation;
    private List<TacheDTO> taches;
    private int nombreTaches;
    private int nombreTachesTerminees;
}
