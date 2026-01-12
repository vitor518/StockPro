package br.ifsp.stockpro.dto.request;

import br.ifsp.stockpro.validation.annotation.ValidPhone;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ClienteRequestDTO {

    @NotBlank(message = "O nome não pode ser vazio")
    @Size(min = 3, max = 100, message = "O nome deve ter entre 3 e 100 caracteres")
    private String nome;

    // A validação de CPF/CNPJ será feita no serviço para tratar os dois tipos
    private String cpfCnpj;

    @ValidPhone
    @Size(max = 20, message = "O contato deve ter no máximo 20 caracteres")
    private String contato;
}
