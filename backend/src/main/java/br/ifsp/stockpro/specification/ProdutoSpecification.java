package br.ifsp.stockpro.specification;

import br.ifsp.stockpro.model.Produto;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;

public class ProdutoSpecification {

    public static Specification<Produto> comNome(String nome) {
        return (root, query, criteriaBuilder) -> {
            if (StringUtils.hasText(nome)) {
                return criteriaBuilder.like(criteriaBuilder.lower(root.get("nome")), "%" + nome.toLowerCase() + "%");
            }
            return criteriaBuilder.conjunction();
        };
    }

    public static Specification<Produto> comCategoria(Long categoriaId) {
        return (root, query, criteriaBuilder) -> {
            if (categoriaId != null) {
                return criteriaBuilder.equal(root.get("categoria").get("id"), categoriaId);
            }
            return criteriaBuilder.conjunction();
        };
    }

    public static Specification<Produto> comPrecoEntre(BigDecimal precoMin, BigDecimal precoMax) {
        return (root, query, criteriaBuilder) -> {
            if (precoMin != null && precoMax != null) {
                return criteriaBuilder.between(root.get("preco"), precoMin, precoMax);
            }
            if (precoMin != null) {
                return criteriaBuilder.greaterThanOrEqualTo(root.get("preco"), precoMin);
            }
            if (precoMax != null) {
                return criteriaBuilder.lessThanOrEqualTo(root.get("preco"), precoMax);
            }
            return criteriaBuilder.conjunction();
        };
    }
}
