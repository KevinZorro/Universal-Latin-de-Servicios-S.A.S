package com.ufps.Universal.Latin.De.Servicios.S.A.S.controller;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO.UsuarioDto;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Empleado;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Gerente;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Rol;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Usuario;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.service.UsuarioService;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.service.GerenteService;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final GerenteService gerenteService;

    public UsuarioController(UsuarioService usuarioService, GerenteService gerenteService) {
        this.usuarioService = usuarioService;
        this.gerenteService = gerenteService;
    }

    @GetMapping
    public List<UsuarioDto> getAllUsuarios() {
        return usuarioService.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{cedula}")
    public ResponseEntity<UsuarioDto> getUsuarioById(@PathVariable String cedula) {
        Optional<Usuario> usuario = usuarioService.findById(cedula);
        return usuario.map(u -> ResponseEntity.ok(toDto(u)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/crear")
    public ResponseEntity<?> crearUsuario(@Valid @RequestBody UsuarioDto dto) {
        try {
            Rol rolEnum;
            try {
                rolEnum = Rol.valueOf(dto.getRol().toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body("Rol no soportado: " + dto.getRol());
            }

            Usuario usuario;

            if (rolEnum == Rol.GERENTE) {
                Gerente gerente = new Gerente();
                gerente.setCedula(dto.getCedula());
                gerente.setNombre(dto.getNombre());
                gerente.setApellido(dto.getApellido());
                gerente.setEmail(dto.getEmail());
                gerente.setTelefono(dto.getTelefono());
                gerente.setPassword(dto.getPassword());
                gerente.setPasswordHash(dto.getPassword());
                gerente.setRol(Rol.GERENTE);
                gerente.setIdrol(dto.getIdrol());

                // ⬇️ USA SOLO gerenteService.save()
                usuario = gerenteService.save(gerente);

            } else if (rolEnum == Rol.EMPLEADO) {
                Empleado empleado = new Empleado();
                empleado.setCedula(dto.getCedula());
                empleado.setNombre(dto.getNombre());
                empleado.setApellido(dto.getApellido());
                empleado.setEmail(dto.getEmail());
                empleado.setTelefono(dto.getTelefono());
                empleado.setPassword(dto.getPassword());
                empleado.setPasswordHash(dto.getPassword());
                empleado.setRol(Rol.EMPLEADO);
                empleado.setIdrol(dto.getIdrol());

                // ⬇️ USA empleadoService.save() (necesitas inyectarlo)
                usuario = usuarioService.save(empleado);

            } else {
                return ResponseEntity.badRequest().body("Rol no soportado: " + dto.getRol());
            }

            return ResponseEntity.ok(toDto(usuario));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body("Error al crear usuario: " + e.getMessage());
        }
    }

    @DeleteMapping("/{cedula}")
    public ResponseEntity<Void> deleteUsuario(@PathVariable String cedula) {
        usuarioService.deleteById(cedula);
        return ResponseEntity.noContent().build();
    }

    // Conversión entre Entity y DTO
    private UsuarioDto toDto(Usuario usuario) {
        UsuarioDto dto = new UsuarioDto();
        dto.setCedula(usuario.getCedula());
        dto.setNombre(usuario.getNombre());
        dto.setApellido(usuario.getApellido());
        dto.setEmail(usuario.getEmail());
        dto.setTelefono(usuario.getTelefono());
        dto.setPassword(usuario.getPassword());
        dto.setRol(usuario.getRol().name());
        dto.setIdrol(usuario.getIdrol());
        return dto;
    }
}
