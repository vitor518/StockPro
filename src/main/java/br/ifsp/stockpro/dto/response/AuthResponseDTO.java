package br.ifsp.stockpro.dto.response;

import br.ifsp.stockpro.model.Usuario;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponseDTO {
    private String token;
    private Usuario usuario;
}
