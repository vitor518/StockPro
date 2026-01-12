package br.ifsp.stockpro.mapper;

import br.ifsp.stockpro.dto.request.CategoriaRequestDTO;
import br.ifsp.stockpro.dto.response.CategoriaResponseDTO;
import br.ifsp.stockpro.model.Categoria;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface CategoriaMapper {

    CategoriaMapper INSTANCE = Mappers.getMapper(CategoriaMapper.class);

    CategoriaResponseDTO toDTO(Categoria categoria);

    Categoria toEntity(CategoriaRequestDTO categoriaRequestDTO);

    void updateEntityFromDto(CategoriaRequestDTO dto, @MappingTarget Categoria entity);
}
