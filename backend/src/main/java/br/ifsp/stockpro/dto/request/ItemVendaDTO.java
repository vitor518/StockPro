package br.ifsp.stockpro.dto.request;

import lombok.Data;

@Data
public class ItemVendaDTO {
    private Long produtoId;
    private Integer qtd;
}
