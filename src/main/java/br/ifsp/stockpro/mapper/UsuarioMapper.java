package br.ifsp.stockpro.mapper;

import br.ifsp.stockpro.dto.response.UsuarioResponseDTO;
import br.ifsp.stockpro.model.Usuario;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UsuarioMapper {

    UsuarioMapper INSTANCE = Mappers.getMapper(UsuarioMapper.class);

    UsuarioResponseDTO toDTO(Usuario usuario);
}
