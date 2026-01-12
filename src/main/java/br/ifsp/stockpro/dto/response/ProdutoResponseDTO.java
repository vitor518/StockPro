package br.ifsp.stockpro.dto.response;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ProdutoResponseDTO {
    private Long id;
    private String nome;
    private BigDecimal preco;
    private Integer qtd;
    private String categoriaNome;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
