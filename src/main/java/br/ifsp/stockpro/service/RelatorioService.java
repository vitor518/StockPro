package br.ifsp.stockpro.service;

import br.ifsp.stockpro.model.Venda;
import br.ifsp.stockpro.repository.VendaRepository;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
public class RelatorioService {

    @Autowired
    private VendaRepository vendaRepository;

    public ByteArrayInputStream gerarRelatorioVendasExcel() throws IOException {
        List<Venda> vendas = vendaRepository.findAll();

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Relatorio de Vendas");

            // Header
            String[] headers = {"ID Venda", "Data", "Cliente", "Total"};
            Row headerRow = sheet.createRow(0);
            for (int col = 0; col < headers.length; col++) {
                Cell cell = headerRow.createCell(col);
                cell.setCellValue(headers[col]);
            }

            // Data
            int rowIdx = 1;
            for (Venda venda : vendas) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(venda.getId());
                row.createCell(1).setCellValue(venda.getData().toString());
                row.createCell(2).setCellValue(venda.getCliente() != null ? venda.getCliente().getNome() : "N/A");
                row.createCell(3).setCellValue(venda.getTotal().doubleValue());
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }
}
