package br.ifsp.stockpro.dto.request;

import lombok.Data;

@Data
public class CategoriaRequestDTO {
    private String nome;
    private String descricao;
    private String icone;
}
