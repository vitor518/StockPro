package br.ifsp.stockpro.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Date;

@Data
@AllArgsConstructor
public class ErrorResponseDTO {
    private Date timestamp;
    private String message;
    private String details;
}
