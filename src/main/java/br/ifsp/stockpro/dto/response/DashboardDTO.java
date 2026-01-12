package br.ifsp.stockpro.dto.response;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class DashboardDTO {
    private long totalVendasHoje;
    private BigDecimal faturamentoHoje;
    private long produtosComEstoqueBaixo;
    private long totalClientes;
}
