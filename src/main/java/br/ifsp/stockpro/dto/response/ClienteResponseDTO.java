package br.ifsp.stockpro.dto.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ClienteResponseDTO {
    private Long id;
    private String nome;
    private String cpfCnpj;
    private String contato;
    private LocalDateTime createdAt;
}
