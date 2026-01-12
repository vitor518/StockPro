package br.ifsp.stockpro.validation.validator;

import br.ifsp.stockpro.validation.annotation.ValidPhone;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.util.StringUtils;

import java.util.regex.Pattern;

public class PhoneValidator implements ConstraintValidator<ValidPhone, String> {

    // Regex para validar números de telefone brasileiros (com DDD e 8 ou 9 dígitos)
    private static final Pattern PHONE_PATTERN = Pattern.compile("^\\(?(\\d{2})\\)?[\\s-]?(\\d{4,5})-?(\\d{4})$");

    @Override
    public boolean isValid(String phone, ConstraintValidatorContext context) {
        if (phone == null || !StringUtils.hasText(phone)) {
            return true;
        }
        return PHONE_PATTERN.matcher(phone).matches();
    }
}
