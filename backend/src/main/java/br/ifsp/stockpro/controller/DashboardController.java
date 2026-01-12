package br.ifsp.stockpro.controller;

import br.ifsp.stockpro.dto.response.DashboardDTO;
import br.ifsp.stockpro.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/resumo")
    public ResponseEntity<DashboardDTO> getDashboardResumo() {
        DashboardDTO dto = dashboardService.getDashboardResumo();
        return ResponseEntity.ok(dto);
    }
}
