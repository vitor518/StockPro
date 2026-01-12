package br.ifsp.stockpro.scheduler;

import br.ifsp.stockpro.model.Produto;
import br.ifsp.stockpro.repository.ProdutoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class EstoqueScheduler {

    private static final Logger logger = LoggerFactory.getLogger(EstoqueScheduler.class);
    private static final int ESTOQUE_BAIXO_THRESHOLD = 10;

    @Autowired
    private ProdutoRepository produtoRepository;

    @Scheduled(fixedRateString = "${scheduler.estoque.fixedRate:3600000}") // Padrão: 1 hora
    public void verificarEstoqueBaixo() {
        logger.info("Executando verificação de estoque baixo...");
        List<Produto> produtosComEstoqueBaixo = produtoRepository.findAllByQtdLessThan(ESTOQUE_BAIXO_THRESHOLD);

        if (!produtosComEstoqueBaixo.isEmpty()) {
            logger.warn("ALERTA DE ESTOQUE BAIXO: {} produto(s) estão abaixo do limite de {} unidades.",
                    produtosComEstoqueBaixo.size(), ESTOQUE_BAIXO_THRESHOLD);
            produtosComEstoqueBaixo.forEach(p ->
                    logger.warn(" - Produto: '{}' (ID: {}), Quantidade: {}", p.getNome(), p.getId(), p.getQtd())
            );
        } else {
            logger.info("Verificação de estoque concluída. Nenhum produto com estoque baixo encontrado.");
        }
    }
}
