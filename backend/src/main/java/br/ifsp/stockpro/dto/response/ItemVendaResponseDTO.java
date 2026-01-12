package br.ifsp.stockpro.dto.response;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ItemVendaResponseDTO {
    private String produtoNome;
    private Integer qtd;
    private BigDecimal precoUnitario;
}
