package br.ifsp.stockpro.controller;

import br.ifsp.stockpro.dto.request.VendaRequestDTO;
import br.ifsp.stockpro.dto.response.VendaResponseDTO;
import br.ifsp.stockpro.service.VendaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/vendas")
public class VendaController {

    @Autowired
    private VendaService vendaService;

    @GetMapping
    public ResponseEntity<List<VendaResponseDTO>> findAll() {
        List<VendaResponseDTO> list = vendaService.findAll();
        return ResponseEntity.ok(list);
    }

    @PostMapping
    public ResponseEntity<VendaResponseDTO> save(@RequestBody VendaRequestDTO vendaRequestDTO) {
        VendaResponseDTO dto = vendaService.save(vendaRequestDTO);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(dto.getId()).toUri();
        return ResponseEntity.created(uri).body(dto);
    }
}
