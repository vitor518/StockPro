package br.ifsp.stockpro.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender emailSender;

    public void sendSimpleMessage(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@stockpro.com"); // Pode ser configurado no properties
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            emailSender.send(message);
        } catch (Exception e) {
            // Em uma aplicação real, seria melhor lançar uma exceção customizada
            // ou usar um logger mais robusto.
            System.err.println("Erro ao enviar e-mail: " + e.getMessage());
        }
    }
}
