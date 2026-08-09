package com.example.gestion_projets.service;

import com.example.gestion_projets.dto.DashboardStatsDTO;
import com.example.gestion_projets.entity.Statut;
import com.example.gestion_projets.repository.TacheRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;

@Service
public class DashboardService {
    private final TacheRepository tacheRepository;

    public DashboardService(TacheRepository tacheRepository) {
        this.tacheRepository = tacheRepository;
    }

    public DashboardStatsDTO getStatsByMonth(int annee, int mois) {
        YearMonth yearMonth = YearMonth.of(annee, mois);
        LocalDateTime debut = yearMonth.atDay(1).atStartOfDay();
        LocalDateTime fin = yearMonth.atEndOfMonth().atTime(23, 59, 59);

        long tachesTerminees = tacheRepository.countByStatutAndDateCreationBetween(Statut.TERMINE, debut, fin);
        long tachesEnCours = tacheRepository.countByStatutAndDateCreationBetween(Statut.EN_COURS, debut, fin);
        long tachesAFaire = tacheRepository.countByStatutAndDateCreationBetween(Statut.A_FAIRE, debut, fin);
        long totalTaches = tachesTerminees + tachesEnCours + tachesAFaire;

        double tauxAvancement = totalTaches > 0 ? (double) tachesTerminees / totalTaches * 100 : 0;

        return new DashboardStatsDTO(annee, mois, tachesTerminees, tachesEnCours, tachesAFaire, totalTaches, tauxAvancement);
    }

    public List<DashboardStatsDTO> getStatsForLastMonths(int nombreMois) {
        List<DashboardStatsDTO> stats = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        for (int i = nombreMois - 1; i >= 0; i--) {
            LocalDateTime date = now.minusMonths(i);
            stats.add(getStatsByMonth(date.getYear(), date.getMonthValue()));
        }

        return stats;
    }

    public DashboardStatsDTO getGlobalStats() {
        long tachesTerminees = tacheRepository.countByStatut(Statut.TERMINE);
        long tachesEnCours = tacheRepository.countByStatut(Statut.EN_COURS);
        long tachesAFaire = tacheRepository.countByStatut(Statut.A_FAIRE);
        long totalTaches = tacheRepository.count();

        double tauxAvancement = totalTaches > 0 ? (double) tachesTerminees / totalTaches * 100 : 0;

        return new DashboardStatsDTO(
                LocalDateTime.now().getYear(),
                LocalDateTime.now().getMonthValue(),
                tachesTerminees,
                tachesEnCours,
                tachesAFaire,
                totalTaches,
                tauxAvancement
        );
    }
}
