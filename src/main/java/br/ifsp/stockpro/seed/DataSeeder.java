package br.ifsp.stockpro.seed;

import br.ifsp.stockpro.enums.RoleUsuario;
import br.ifsp.stockpro.model.Usuario;
import br.ifsp.stockpro.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${admin.default.password:admin123}")
    private String adminDefaultPassword;

    @Override
    @Transactional // Garante que a operação seja tratada corretamente pelo banco
    public void run(String... args) throws Exception {
        seedAdminUser();
    }

    private void seedAdminUser() {
        if (usuarioRepository.count() == 0) {
            Usuario admin = new Usuario();
            admin.setNome("Admin User");
            admin.setEmail("admin@stockpro.com");
            admin.setSenha(passwordEncoder.encode(adminDefaultPassword));
            admin.setRole(RoleUsuario.ADMIN);
            admin.setAtivo(true);
            
            // O salvamento agora não deve quebrar pois o SecurityUtils 
            // está preparado para retornar Optional.empty() em vez de erro.
            usuarioRepository.save(admin);
            System.out.println("Usuário administrador inicial criado com sucesso!");
        }
    }
}