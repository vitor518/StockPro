package br.ifsp.stockpro.dto.response;

import lombok.Data;
import java.time.LocalDate;

@Data
public class RelatorioEstoqueDTO {
    private String produtoNome;
    private String categoriaNome;
    private int quantidadeAtual;
    private LocalDate ultimaMovimentacao;
    // ...
}
