package br.ifsp.stockpro.controller;

import br.ifsp.stockpro.dto.request.LoginRequestDTO;
import br.ifsp.stockpro.dto.request.RegisterRequestDTO;
import br.ifsp.stockpro.dto.response.AuthResponseDTO;
import br.ifsp.stockpro.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> authenticateUser(@Valid @RequestBody LoginRequestDTO loginRequestDTO) {
        AuthResponseDTO authResponse = authService.loginUser(loginRequestDTO);
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequestDTO registerRequestDTO) {
        authService.registerUser(registerRequestDTO);
        return ResponseEntity.ok("Usuário registrado com sucesso!");
    }
}
