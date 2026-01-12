package br.ifsp.stockpro.event.listener;

import br.ifsp.stockpro.event.VendaFinalizadaEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class VendaEventListener {

    private static final Logger logger = LoggerFactory.getLogger(VendaEventListener.class);

    @EventListener
    public void onVendaFinalizada(VendaFinalizadaEvent event) {
        logger.info("EVENTO: Venda #{} finalizada. Valor total: R$ {}",
                event.getVenda().getId(), event.getVenda().getTotal());
        // Aqui poderia entrar a lógica para enviar e-mail, notificar outros sistemas, etc.
    }
}
