package com.ufps.Universal.Latin.De.Servicios.S.A.S.service;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Empleado;
import org.springframework.stereotype.Service;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Gerente;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Rol;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Usuario;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.repository.UsuarioRepository;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO.RegistroDto;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.Optional;

@Service
public class AuthService {
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UsuarioRepository repo, PasswordEncoder encoder) {
        this.usuarioRepository = repo;
        this.passwordEncoder = encoder;
    }

    public Usuario login(String cedula, String password) {
        Optional<Usuario> optionalUser = usuarioRepository.findById(cedula);
        if (optionalUser.isPresent()) {
            Usuario u = optionalUser.get();
            if (passwordEncoder.matches(password, u.getPasswordHash())) { // Usa el nombre real del campo en tu entidad
                return u;
            }
        }else {
            throw new IllegalArgumentException("Credenciales inválidas");
            
        }
        return null;
    }

public Usuario registrar(RegistroDto dto) {
    String passwordHash = passwordEncoder.encode(dto.getPassword());
    Usuario u = null;

    if ("EMPLEADO".equalsIgnoreCase(dto.getRol())) {
        u = Empleado.builder()
            .cedula(dto.getCedula())
            .nombre(dto.getNombre())
            .apellido(dto.getApellido())
            .telefono(dto.getTelefono())
            .email(dto.getEmail())
            .passwordHash(passwordHash)
            .rol(Rol.EMPLEADO)  // Asegúrate de asignar el rol correcto
            // Para campos adicionales de Empleado, agrega valores aquí o setters después
            .activo(true)       // ejemplo
            .fechaIngreso(LocalDate.now()) // ejemplo
            .cargo("Default Cargo")         // ejemplo, o recibe desde dto
            .build();
    } else if ("GERENTE".equalsIgnoreCase(dto.getRol())) {
        u = Gerente.builder()
            .cedula(dto.getCedula())
            .nombre(dto.getNombre())
            .apellido(dto.getApellido())
            .telefono(dto.getTelefono())
            .email(dto.getEmail())
            .passwordHash(passwordHash)
            .rol(Rol.GERENTE)
            .build();
    } else {
        throw new IllegalArgumentException("Tipo de usuario inválido.");
    }

    return usuarioRepository.save(u);
}

}
