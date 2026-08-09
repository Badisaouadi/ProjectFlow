package com.example.gestion_projets.dto;

import com.example.gestion_projets.entity.Priorite;
import com.example.gestion_projets.entity.Statut;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TacheDTO {
    private Long id;
    private String titre;
    private String description;
    private Statut statut;
    private Priorite priorite;
    private LocalDateTime dateCreation;
    private LocalDateTime dateEcheance;
    private Long projetId;
    private String projetNom;
    private List<SousTacheDTO> sousTaches;
}
