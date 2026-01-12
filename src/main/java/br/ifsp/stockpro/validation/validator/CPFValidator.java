package br.ifsp.stockpro.validation.validator;

// Importamos o pacote, mas não podemos usar o "as"
import br.ifsp.stockpro.validation.annotation.ValidCPF;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.util.StringUtils;

public class CPFValidator implements ConstraintValidator<ValidCPF, String> {

    // Usamos o caminho completo para diferenciar da sua classe atual
    private final br.com.caelum.stella.validation.CPFValidator stellaValidator = 
            new br.com.caelum.stella.validation.CPFValidator();

    @Override
    public boolean isValid(String cpf, ConstraintValidatorContext context) {
        // Retorna true se estiver vazio para permitir que o @NotBlank cuide da obrigatoriedade
        if (cpf == null || !StringUtils.hasText(cpf)) {
            return true;
        }
        
        try {
            // A biblioteca Stella valida tanto o formato quanto os dígitos verificadores
            stellaValidator.assertValid(cpf);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}