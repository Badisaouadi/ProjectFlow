package com.example.gestion_projets.controller;

import com.example.gestion_projets.entity.Utilisateur;
import com.example.gestion_projets.service.UtilisateurService;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {
    private final UtilisateurService utilisateurService;

    public AuthController(UtilisateurService utilisateurService) {
        this.utilisateurService = utilisateurService;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String motDePasse = credentials.get("motDePasse");

        Utilisateur utilisateur = utilisateurService.getUtilisateurByEmail(email);

        if (utilisateurService.authenticate(email, motDePasse)) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Connexion réussie");
            response.put("utilisateur", utilisateur);
            return response;
        } else {
            throw new RuntimeException("Identifiants incorrects");
        }
    }

    @PostMapping("/register")
    public Utilisateur register(@RequestBody Utilisateur utilisateur) {
        return utilisateurService.createUtilisateur(utilisateur);
    }
}