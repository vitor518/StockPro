package br.ifsp.stockpro.dto.response;

import br.ifsp.stockpro.enums.RoleUsuario;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UsuarioResponseDTO {
    private Long id;
    private String nome;
    private String email;
    private RoleUsuario role;
    private Boolean ativo;
    private LocalDateTime createdAt;
}
