package com.ufps.Universal.Latin.De.Servicios.S.A.S.service;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Empleado;
import org.springframework.stereotype.Service;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Gerente;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Usuario;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.repository.UsuarioRepository;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO.RegistroDto;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class AuthService {
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UsuarioRepository repo, PasswordEncoder encoder) {
        this.usuarioRepository = repo;
        this.passwordEncoder = encoder;
    }

    public Usuario registrar(RegistroDto dto) {
        String passwordHash = passwordEncoder.encode(dto.password);
        Usuario u;
        if(dto.tipoUsuario.equals("EMPLEADO")) {
            u = Empleado.builder()
                .cedula(dto.cedula)
                .nombre(dto.nombre)
                .apellido(dto.apellido)
                .telefono(dto.telefono)
                .email(dto.email)
                .passwordHash(passwordHash)
                // ...otros campos...
                .build();
        } else if(dto.tipoUsuario.equals("GERENTE")) {
            u = Gerente.builder()
                .cedula(dto.cedula)
                .nombre(dto.nombre)
                .apellido(dto.apellido)
                .telefono(dto.telefono)
                .email(dto.email)
                .passwordHash(passwordHash)
                .build();
        } else {
            throw new IllegalArgumentException("Tipo usuario no soportado");
        }
        return usuarioRepository.save(u);
    }
}
