package br.ifsp.stockpro.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Optional;

public class SecurityUtils {

    public static Optional<String> getCurrentUsername() {
        // Pega a autenticação atual
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        // Se não houver autenticação ou não estiver autenticado, retorna vazio com segurança
        if (authentication == null || !authentication.isAuthenticated()) {
            return Optional.empty();
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof UserDetails) {
            return Optional.of(((UserDetails) principal).getUsername());
        }
        if (principal instanceof String) {
            return Optional.of((String) principal);
        }
        
        return Optional.empty();
    }
}