
package br.ifsp.stockpro.dto.response;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class CategoriaResponseDTO {
    private Long id;
    private String nome;
    private String descricao;
    private String icone;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
