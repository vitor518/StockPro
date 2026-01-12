package br.ifsp.stockpro.mapper;

import br.ifsp.stockpro.dto.request.ProdutoRequestDTO;
import br.ifsp.stockpro.dto.response.ProdutoResponseDTO;
import br.ifsp.stockpro.model.Produto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface ProdutoMapper {

    ProdutoMapper INSTANCE = Mappers.getMapper(ProdutoMapper.class);

    @Mapping(source = "categoria.nome", target = "categoriaNome")
    ProdutoResponseDTO toDTO(Produto produto);

    @Mapping(target = "categoria", ignore = true) // Categoria será setada manualmente no service
    Produto toEntity(ProdutoRequestDTO produtoRequestDTO);

    void updateEntityFromDto(ProdutoRequestDTO dto, @MappingTarget Produto entity);
}
