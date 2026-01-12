package br.ifsp.stockpro.service;

import br.ifsp.stockpro.dto.request.ItemVendaDTO;
import br.ifsp.stockpro.dto.request.VendaRequestDTO;
import br.ifsp.stockpro.dto.response.VendaResponseDTO;
import br.ifsp.stockpro.enums.StatusVenda;
import br.ifsp.stockpro.exception.InsufficientStockException;
import br.ifsp.stockpro.exception.ResourceNotFoundException;
import br.ifsp.stockpro.mapper.VendaMapper;
import br.ifsp.stockpro.model.*;
import br.ifsp.stockpro.event.VendaFinalizadaEvent;
import br.ifsp.stockpro.repository.ClienteRepository;
import br.ifsp.stockpro.repository.ProdutoRepository;
import br.ifsp.stockpro.repository.VendaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class VendaService {

    @Autowired
    private VendaRepository vendaRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private VendaMapper vendaMapper;

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    @Transactional(readOnly = true)
    public List<VendaResponseDTO> findAll() {
        List<Venda> vendas = vendaRepository.findAll();
        return vendas.stream()
                .map(vendaMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public VendaResponseDTO save(VendaRequestDTO vendaRequestDTO) {
        Venda venda = new Venda();
        venda.setData(LocalDateTime.now());
        venda.setStatus(StatusVenda.FINALIZADA);

        if (vendaRequestDTO.getClienteId() != null) {
            Cliente cliente = clienteRepository.findById(vendaRequestDTO.getClienteId())
                    .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com o id: " + vendaRequestDTO.getClienteId()));
            venda.setCliente(cliente);
        }

        List<ItemVenda> itensVenda = new ArrayList<>();
        BigDecimal totalVenda = BigDecimal.ZERO;

        for (ItemVendaDTO itemDTO : vendaRequestDTO.getItens()) {
            Produto produto = produtoRepository.findById(itemDTO.getProdutoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado com o id: " + itemDTO.getProdutoId()));

            if (produto.getQtd() < itemDTO.getQtd()) {
                throw new InsufficientStockException("Estoque insuficiente para o produto: " + produto.getNome());
            }

            produto.setQtd(produto.getQtd() - itemDTO.getQtd());
            produtoRepository.save(produto);

            ItemVenda itemVenda = new ItemVenda();
            itemVenda.setProduto(produto);
            itemVenda.setQtd(itemDTO.getQtd());
            itemVenda.setPreco(produto.getPreco());
            itemVenda.setVenda(venda);
            itensVenda.add(itemVenda);

            totalVenda = totalVenda.add(produto.getPreco().multiply(BigDecimal.valueOf(itemDTO.getQtd())));
        }

        venda.setItens(itensVenda);
        venda.setTotal(totalVenda);
        venda = vendaRepository.save(venda);

        eventPublisher.publishEvent(new VendaFinalizadaEvent(this, venda));

        return vendaMapper.toDTO(venda);
    }
}
