package br.ifsp.stockpro.dto.response;

import br.ifsp.stockpro.enums.StatusVenda;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class VendaResponseDTO {
    private Long id;
    private LocalDateTime data;
    private BigDecimal total;
    private StatusVenda status;
    private String clienteNome;
    private List<ItemVendaResponseDTO> itens;
}
