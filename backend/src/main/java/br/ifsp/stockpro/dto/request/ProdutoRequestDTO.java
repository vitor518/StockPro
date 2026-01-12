package br.ifsp.stockpro.dto.request;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProdutoRequestDTO {
    private String nome;
    private BigDecimal preco;
    private Integer qtd;
    private Long categoriaId;
}
