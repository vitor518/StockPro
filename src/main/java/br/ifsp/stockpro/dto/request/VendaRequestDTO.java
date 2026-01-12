package br.ifsp.stockpro.dto.request;

import java.util.List;
import lombok.Data;

@Data
public class VendaRequestDTO {
    private Long clienteId;
    private List<ItemVendaDTO> itens;
}
