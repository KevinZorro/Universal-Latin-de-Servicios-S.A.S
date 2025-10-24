package com.ufps.Universal.Latin.De.Servicios.S.A.S.service;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Usuario;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public List<Usuario> findAll() { return usuarioRepository.findAll(); }

    public Optional<Usuario> findById(String cedula) { return usuarioRepository.findById(cedula); }

    public Usuario save(Usuario usuario) { return usuarioRepository.save(usuario); }

    public void deleteById(String cedula) { usuarioRepository.deleteById(cedula); }
}
