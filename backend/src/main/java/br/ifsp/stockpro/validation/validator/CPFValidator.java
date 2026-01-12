package br.ifsp.stockpro.validation.validator;

import br.com.caelum.stella.validation.CPFValidator as StellaCPFValidator;
import br.ifsp.stockpro.validation.annotation.ValidCPF;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.util.StringUtils;

public class CPFValidator implements ConstraintValidator<ValidCPF, String> {

    private final StellaCPFValidator stellaValidator = new StellaCPFValidator();

    @Override
    public boolean isValid(String cpf, ConstraintValidatorContext context) {
        if (cpf == null || !StringUtils.hasText(cpf)) {
            return true; // Considera nulo/vazio como válido para não conflitar com @NotBlank
        }
        try {
            stellaValidator.assertValid(cpf);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
