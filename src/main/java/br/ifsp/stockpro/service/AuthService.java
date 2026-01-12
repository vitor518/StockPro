package br.ifsp.stockpro.service;

import br.ifsp.stockpro.dto.request.LoginRequestDTO;
import br.ifsp.stockpro.dto.request.RegisterRequestDTO;
import br.ifsp.stockpro.dto.response.AuthResponseDTO;
import br.ifsp.stockpro.exception.BusinessException;
import br.ifsp.stockpro.model.Usuario;
import br.ifsp.stockpro.repository.UsuarioRepository;
import br.ifsp.stockpro.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Transactional
    public Usuario registerUser(RegisterRequestDTO registerRequestDTO) {
        if (usuarioRepository.findByEmail(registerRequestDTO.getEmail()).isPresent()) {
            throw new BusinessException("Endereço de e-mail já está em uso!");
        }

        Usuario usuario = new Usuario();
        usuario.setNome(registerRequestDTO.getNome());
        usuario.setEmail(registerRequestDTO.getEmail());
        usuario.setSenha(passwordEncoder.encode(registerRequestDTO.getSenha()));
        usuario.setRole(registerRequestDTO.getRole());
        usuario.setAtivo(true);

        return usuarioRepository.save(usuario);
    }

    public AuthResponseDTO loginUser(LoginRequestDTO loginRequestDTO) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequestDTO.getEmail(),
                        loginRequestDTO.getSenha()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken(authentication);
        Usuario usuario = usuarioRepository.findByEmail(loginRequestDTO.getEmail()).get();

        return new AuthResponseDTO(jwt, usuario);
    }
}
