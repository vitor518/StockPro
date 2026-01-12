package br.ifsp.stockpro.util;

import br.ifsp.stockpro.dto.ResponseDTO;

public class ResponseUtil {

    public static <T> ResponseDTO<T> success(T data) {
        return new ResponseDTO<>(true, data, null);
    }

    public static <T> ResponseDTO<T> success(T data, String message) {
        return new ResponseDTO<>(true, data, message);
    }

    public static ResponseDTO<Void> error(String message) {
        return new ResponseDTO<>(false, null, message);
    }
}
