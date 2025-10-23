package com.ufps.Universal.Latin.De.Servicios.S.A.S.controller;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO.UsuarioDto;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Usuario;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Rol;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.service.UsuarioService;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/usuarios")
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
    public UsuarioDto getUsuarioById(@PathVariable Integer cedula) {
        Optional<Usuario> usuario = usuarioService.findById(cedula);
        return usuario.map(this::toDto).orElse(null);
    }

    @PostMapping
    public UsuarioDto createUsuario(@Valid @RequestBody UsuarioDto usuarioDto) {
        Usuario usuario = toEntity(usuarioDto);
        Usuario saved = usuarioService.save(usuario);
        return toDto(saved);
    }

    @PutMapping("/{cedula}")
    public UsuarioDto updateUsuario(@PathVariable Integer cedula, @Valid @RequestBody UsuarioDto usuarioDto) {
        Usuario usuario = toEntity(usuarioDto);
        usuario.setCedula(cedula);
        Usuario updated = usuarioService.save(usuario);
        return toDto(updated);
    }

    @DeleteMapping("/{cedula}")
    public void deleteUsuario(@PathVariable Integer cedula) {
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

    private Usuario toEntity(UsuarioDto dto) {
        return Usuario.builder()
                .cedula(dto.getCedula())
                .telefono(dto.getTelefono())
                .passwordHash(dto.getPassword())
                .email(dto.getEmail())
                .apellido(dto.getApellido())
                .nombre(dto.getNombre())
                .rol(Rol.valueOf(dto.getRol()))
                .build();
    }
}
