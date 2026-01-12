package br.ifsp.stockpro.repository;

import br.ifsp.stockpro.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long>, JpaSpecificationExecutor<Produto> {
    long countByQtdLessThan(int qtd);
    List<Produto> findAllByQtdLessThan(int qtd);
}
