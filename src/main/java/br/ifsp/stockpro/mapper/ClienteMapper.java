package br.ifsp.stockpro.mapper;

import br.ifsp.stockpro.dto.request.ClienteRequestDTO;
import br.ifsp.stockpro.dto.response.ClienteResponseDTO;
import br.ifsp.stockpro.model.Cliente;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;
import org.mapstruct.ReportingPolicy;
@Mapper(componentModel = "spring")
public interface ClienteMapper {

    ClienteMapper INSTANCE = Mappers.getMapper(ClienteMapper.class);

    ClienteResponseDTO toDTO(Cliente cliente);

    Cliente toEntity(ClienteRequestDTO clienteRequestDTO);

    void updateEntityFromDto(ClienteRequestDTO dto, @MappingTarget Cliente entity);
}
