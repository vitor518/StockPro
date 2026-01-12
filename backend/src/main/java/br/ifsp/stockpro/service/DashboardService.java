package br.ifsp.stockpro.service;

import br.ifsp.stockpro.dto.response.DashboardDTO;
import br.ifsp.stockpro.model.Venda;
import br.ifsp.stockpro.repository.ClienteRepository;
import br.ifsp.stockpro.repository.ProdutoRepository;
import br.ifsp.stockpro.repository.VendaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class DashboardService {

    @Autowired
    private VendaRepository vendaRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    private static final int ESTOQUE_BAIXO_THRESHOLD = 10;

    @Transactional(readOnly = true)
    public DashboardDTO getDashboardResumo() {
        DashboardDTO dto = new DashboardDTO();

        // Métricas de Vendas de Hoje
        LocalDateTime inicioDoDia = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
        LocalDateTime fimDoDia = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);
        List<Venda> vendasDeHoje = vendaRepository.findByDataBetween(inicioDoDia, fimDoDia);

        long totalVendasHoje = vendasDeHoje.size();
        BigDecimal faturamentoHoje = vendasDeHoje.stream()
                .map(Venda::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        dto.setTotalVendasHoje(totalVendasHoje);
        dto.setFaturamentoHoje(faturamentoHoje);

        // Métricas de Estoque
        long produtosComEstoqueBaixo = produtoRepository.countByQtdLessThan(ESTOQUE_BAIXO_THRESHOLD);
        dto.setProdutosComEstoqueBaixo(produtosComEstoqueBaixo);

        // Métricas de Clientes
        long totalClientes = clienteRepository.count();
        dto.setTotalClientes(totalClientes);

        return dto;
    }
}
