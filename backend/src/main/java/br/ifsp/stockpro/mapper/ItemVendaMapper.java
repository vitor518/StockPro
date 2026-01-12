package br.ifsp.stockpro.mapper;

import br.ifsp.stockpro.dto.response.ItemVendaResponseDTO;
import br.ifsp.stockpro.model.ItemVenda;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ItemVendaMapper {

    ItemVendaMapper INSTANCE = Mappers.getMapper(ItemVendaMapper.class);

    @Mapping(source = "produto.nome", target = "produtoNome")
    @Mapping(source = "preco", target = "precoUnitario")
    ItemVendaResponseDTO toDTO(ItemVenda itemVenda);
}
