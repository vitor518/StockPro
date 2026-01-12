package br.ifsp.stockpro.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@Configuration
@EnableAsync
@EnableScheduling
public class TaskConfig {
    // A configuração do AsyncExecutor pode ser adicionada aqui se necessário
}
