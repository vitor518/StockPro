package br.ifsp.stockpro.validation.validator;

import br.com.caelum.stella.validation.CNPJValidator as StellaCNPJValidator;
import br.ifsp.stockpro.validation.annotation.ValidCNPJ;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.util.StringUtils;

public class CNPJValidator implements ConstraintValidator<ValidCNPJ, String> {

    private final StellaCNPJValidator stellaValidator = new StellaCNPJValidator();

    @Override
    public boolean isValid(String cnpj, ConstraintValidatorContext context) {
        if (cnpj == null || !StringUtils.hasText(cnpj)) {
            return true;
        }
        try {
            stellaValidator.assertValid(cnpj);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
