package br.ifsp.stockpro.service;

import br.ifsp.stockpro.dto.request.ProdutoRequestDTO;
import br.ifsp.stockpro.dto.response.ProdutoResponseDTO;
import br.ifsp.stockpro.exception.ResourceNotFoundException;
import br.ifsp.stockpro.mapper.ProdutoMapper;
import br.ifsp.stockpro.model.Categoria;
import br.ifsp.stockpro.model.Produto;
import br.ifsp.stockpro.repository.CategoriaRepository;
import br.ifsp.stockpro.repository.ProdutoRepository;
import br.ifsp.stockpro.specification.ProdutoSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProdutoService {
    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private ProdutoMapper produtoMapper;

    @Transactional(readOnly = true)
    public List<ProdutoResponseDTO> findAll() {
        List<Produto> produtos = produtoRepository.findAll();
        return produtos.stream()
                .map(produtoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProdutoResponseDTO> search(String nome, Long categoriaId, BigDecimal precoMin, BigDecimal precoMax) {
        Specification<Produto> spec = Specification.where(ProdutoSpecification.comNome(nome))
                .and(ProdutoSpecification.comCategoria(categoriaId))
                .and(ProdutoSpecification.comPrecoEntre(precoMin, precoMax));

        List<Produto> produtos = produtoRepository.findAll(spec);
        return produtos.stream()
                .map(produtoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProdutoResponseDTO findById(Long id) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado com o id: " + id));
        return produtoMapper.toDTO(produto);
    }

    @Transactional
    public ProdutoResponseDTO save(ProdutoRequestDTO produtoRequestDTO) {
        Categoria categoria = categoriaRepository.findById(produtoRequestDTO.getCategoriaId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada com o id: " + produtoRequestDTO.getCategoriaId()));

        Produto produto = produtoMapper.toEntity(produtoRequestDTO);
        produto.setCategoria(categoria);
        produto = produtoRepository.save(produto);
        return produtoMapper.toDTO(produto);
    }

    @Transactional
    public ProdutoResponseDTO update(Long id, ProdutoRequestDTO produtoRequestDTO) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado com o id: " + id));

        Categoria categoria = categoriaRepository.findById(produtoRequestDTO.getCategoriaId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada com o id: " + produtoRequestDTO.getCategoriaId()));

        produtoMapper.updateEntityFromDto(produtoRequestDTO, produto);
        produto.setCategoria(categoria);

        produto = produtoRepository.save(produto);
        return produtoMapper.toDTO(produto);
    }

    @Transactional
    public void deleteById(Long id) {
        if (!produtoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Produto não encontrado com o id: " + id);
        }
        produtoRepository.deleteById(id);
    }
}
