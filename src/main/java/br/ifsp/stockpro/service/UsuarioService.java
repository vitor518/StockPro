package br.ifsp.stockpro.service;

import br.ifsp.stockpro.dto.request.UsuarioUpdateDTO;
import br.ifsp.stockpro.dto.response.UsuarioResponseDTO;
import br.ifsp.stockpro.exception.ResourceNotFoundException;
import br.ifsp.stockpro.mapper.UsuarioMapper;
import br.ifsp.stockpro.model.Usuario;
import br.ifsp.stockpro.repository.UsuarioRepository;
import br.ifsp.stockpro.security.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private UsuarioMapper usuarioMapper;

    @Transactional(readOnly = true)
    public UsuarioResponseDTO getProfile() {
        String userEmail = SecurityUtils.getCurrentUsername()
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não autenticado"));
        
        Usuario usuario = usuarioRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
        
        return usuarioMapper.toDTO(usuario);
    }

    @Transactional
    public UsuarioResponseDTO updateProfile(UsuarioUpdateDTO usuarioUpdateDTO) {
        String userEmail = SecurityUtils.getCurrentUsername()
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não autenticado"));
        
        Usuario usuario = usuarioRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        usuario.setNome(usuarioUpdateDTO.getNome());
        usuario.setEmail(usuarioUpdateDTO.getEmail());
        
        usuario = usuarioRepository.save(usuario);
        
        return usuarioMapper.toDTO(usuario);
    }
}
