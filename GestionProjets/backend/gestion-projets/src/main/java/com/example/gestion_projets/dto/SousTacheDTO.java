package com.example.gestion_projets.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SousTacheDTO {
    private Long id;
    private String titre;
    private String description;
    private boolean terminee;
    private Long tacheId;
}
