package br.ifsp.stockpro.dto.request;

import lombok.Data;
import java.time.LocalDate;

@Data
public class FiltroRelatorioDTO {
    private LocalDate dataInicio;
    private LocalDate dataFim;
    private Long clienteId;
    private Long categoriaId;
}
