package br.ifsp.stockpro.dto.response;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class RelatorioVendasDTO {
    private LocalDate periodo;
    private long totalVendas;
    private BigDecimal faturamentoTotal;
    // ... outros campos relevantes
}
