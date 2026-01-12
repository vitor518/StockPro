package br.ifsp.stockpro.service;

import br.ifsp.stockpro.dto.request.CategoriaRequestDTO;
import br.ifsp.stockpro.dto.response.CategoriaResponseDTO;
import br.ifsp.stockpro.exception.ResourceNotFoundException;
import br.ifsp.stockpro.mapper.CategoriaMapper;
import br.ifsp.stockpro.model.Categoria;
import br.ifsp.stockpro.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private CategoriaMapper categoriaMapper;

    @Cacheable("categorias")
    @Transactional(readOnly = true)
    public List<CategoriaResponseDTO> findAll() {
        List<Categoria> categorias = categoriaRepository.findAll();
        return categorias.stream()
                .map(categoriaMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CategoriaResponseDTO findById(Long id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada com o id: " + id));
        return categoriaMapper.toDTO(categoria);
    }

    @Transactional
    @CacheEvict(value = "categorias", allEntries = true)
    public CategoriaResponseDTO save(CategoriaRequestDTO categoriaRequestDTO) {
        Categoria categoria = categoriaMapper.toEntity(categoriaRequestDTO);
        categoria = categoriaRepository.save(categoria);
        return categoriaMapper.toDTO(categoria);
    }

    @Transactional
    @CacheEvict(value = "categorias", allEntries = true)
    public CategoriaResponseDTO update(Long id, CategoriaRequestDTO categoriaRequestDTO) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada com o id: " + id));

        categoriaMapper.updateEntityFromDto(categoriaRequestDTO, categoria);

        categoria = categoriaRepository.save(categoria);
        return categoriaMapper.toDTO(categoria);
    }

    @Transactional
    @CacheEvict(value = "categorias", allEntries = true)
    public void deleteById(Long id) {
        if (!categoriaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Categoria não encontrada com o id: " + id);
        }
        categoriaRepository.deleteById(id);
    }
}
