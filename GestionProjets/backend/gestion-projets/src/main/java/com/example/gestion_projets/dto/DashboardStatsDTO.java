package com.example.gestion_projets.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private int annee;
    private int mois;
    private long tachesTerminees;
    private long tachesEnCours;
    private long tachesAFaire;
    private long totalTaches;
    private double tauxAvancement;
}
