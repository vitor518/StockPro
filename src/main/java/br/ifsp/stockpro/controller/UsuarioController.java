package br.ifsp.stockpro.controller;

import br.ifsp.stockpro.dto.request.UsuarioUpdateDTO;
import br.ifsp.stockpro.dto.response.UsuarioResponseDTO;
import br.ifsp.stockpro.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/usuario")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping("/perfil")
    public ResponseEntity<UsuarioResponseDTO> getProfile() {
        UsuarioResponseDTO dto = usuarioService.getProfile();
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/perfil")
    public ResponseEntity<UsuarioResponseDTO> updateProfile(@Valid @RequestBody UsuarioUpdateDTO usuarioUpdateDTO) {
        UsuarioResponseDTO dto = usuarioService.updateProfile(usuarioUpdateDTO);
        return ResponseEntity.ok(dto);
    }
}
