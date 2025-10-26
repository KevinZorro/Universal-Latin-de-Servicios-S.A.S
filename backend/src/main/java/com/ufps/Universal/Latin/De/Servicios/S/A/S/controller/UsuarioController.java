package com.ufps.Universal.Latin.De.Servicios.S.A.S.controller;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO.UsuarioDto;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Usuario;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.service.UsuarioService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:3000")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public List<UsuarioDto> getAllUsuarios() {
        return usuarioService.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{cedula}")
    public UsuarioDto getUsuarioById(@PathVariable String cedula) {
        Optional<Usuario> usuario = usuarioService.findById(cedula);
        return usuario.map(this::toDto).orElse(null);
    }


    @DeleteMapping("/{cedula}")
    public void deleteUsuario(@PathVariable String cedula) {
        usuarioService.deleteById(cedula);
    }

    // Conversión entre Entity y DTO
    private UsuarioDto toDto(Usuario usuario) {
        UsuarioDto dto = new UsuarioDto();
        dto.setCedula(usuario.getCedula());
        dto.setTelefono(usuario.getTelefono());
        dto.setPassword(usuario.getPasswordHash());
        dto.setEmail(usuario.getEmail());
        dto.setApellido(usuario.getApellido());
        dto.setNombre(usuario.getNombre());
        dto.setRol(usuario.getRol().name());
        return dto;
    }
}
