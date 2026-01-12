package br.ifsp.stockpro.event;

import br.ifsp.stockpro.model.Venda;
import org.springframework.context.ApplicationEvent;

public class VendaFinalizadaEvent extends ApplicationEvent {
    
    private final Venda venda;

    public VendaFinalizadaEvent(Object source, Venda venda) {
        super(source);
        this.venda = venda;
    }

    public Venda getVenda() {
        return venda;
    }
}
