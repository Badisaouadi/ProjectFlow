package com.example.gestion_projets.controller;

import com.example.gestion_projets.dto.DashboardStatsDTO;
import com.example.gestion_projets.service.DashboardService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:4200")
public class DashboardController {
    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/stats/global")
    public DashboardStatsDTO getGlobalStats() {
        return dashboardService.getGlobalStats();
    }

    @GetMapping("/stats/mois/{annee}/{mois}")
    public DashboardStatsDTO getStatsByMonth(@PathVariable int annee, @PathVariable int mois) {
        return dashboardService.getStatsByMonth(annee, mois);
    }

    @GetMapping("/stats/derniers-mois/{nombreMois}")
    public List<DashboardStatsDTO> getStatsForLastMonths(@PathVariable int nombreMois) {
        return dashboardService.getStatsForLastMonths(nombreMois);
    }
}
