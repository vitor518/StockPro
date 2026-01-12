package br.ifsp.stockpro.mapper;

import br.ifsp.stockpro.dto.response.VendaResponseDTO;
import br.ifsp.stockpro.model.Venda;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", uses = {ItemVendaMapper.class})
public interface VendaMapper {

    VendaMapper INSTANCE = Mappers.getMapper(VendaMapper.class);

    @Mapping(source = "cliente.nome", target = "clienteNome")
    @Mapping(source = "itens", target = "itens")
    VendaResponseDTO toDTO(Venda venda);
}
