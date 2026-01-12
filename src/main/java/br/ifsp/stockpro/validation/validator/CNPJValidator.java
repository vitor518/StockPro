package br.ifsp.stockpro.validation.validator;

import br.ifsp.stockpro.validation.annotation.ValidCNPJ;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.util.StringUtils;

// Como sua classe tem o mesmo nome (CNPJValidator), 
// precisamos diferenciar qual é qual no corpo do código.
public class CNPJValidator implements ConstraintValidator<ValidCNPJ, String> {

    // Usamos o nome completo (FQN) para evitar ambiguidade com a sua própria classe
    private final br.com.caelum.stella.validation.CNPJValidator stellaValidator = 
            new br.com.caelum.stella.validation.CNPJValidator();

    @Override
    public boolean isValid(String cnpj, ConstraintValidatorContext context) {
        // Se estiver vazio, o Bean Validation entende que @NotBlank deve cuidar disso, 
        // então retornamos true para não validar duas vezes a mesma coisa.
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