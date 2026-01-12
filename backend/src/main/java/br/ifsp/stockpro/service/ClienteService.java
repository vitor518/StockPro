package br.ifsp.stockpro.service;

import br.ifsp.stockpro.dto.request.ClienteRequestDTO;
import br.ifsp.stockpro.dto.response.ClienteResponseDTO;
import br.ifsp.stockpro.exception.ResourceNotFoundException;
import br.ifsp.stockpro.mapper.ClienteMapper;
import br.ifsp.stockpro.model.Cliente;
import br.ifsp.stockpro.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private ClienteMapper clienteMapper;

    @Transactional(readOnly = true)
    public List<ClienteResponseDTO> findAll() {
        List<Cliente> clientes = clienteRepository.findAll();
        return clientes.stream()
                .map(clienteMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ClienteResponseDTO findById(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com o id: " + id));
        return clienteMapper.toDTO(cliente);
    }

    @Transactional
    public ClienteResponseDTO save(ClienteRequestDTO clienteRequestDTO) {
        Cliente cliente = clienteMapper.toEntity(clienteRequestDTO);
        cliente = clienteRepository.save(cliente);
        return clienteMapper.toDTO(cliente);
    }

    @Transactional
    public ClienteResponseDTO update(Long id, ClienteRequestDTO clienteRequestDTO) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com o id: " + id));

        clienteMapper.updateEntityFromDto(clienteRequestDTO, cliente);

        cliente = clienteRepository.save(cliente);
        return clienteMapper.toDTO(cliente);
    }

    @Transactional
    public void deleteById(Long id) {
        if (!clienteRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cliente não encontrado com o id: " + id);
        }
        clienteRepository.deleteById(id);
    }
}
