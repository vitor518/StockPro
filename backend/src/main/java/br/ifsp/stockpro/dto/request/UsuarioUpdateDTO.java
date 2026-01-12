package br.ifsp.stockpro.dto.request;

import lombok.Data;

@Data
public class UsuarioUpdateDTO {
    private String nome;
    private String email;
}
