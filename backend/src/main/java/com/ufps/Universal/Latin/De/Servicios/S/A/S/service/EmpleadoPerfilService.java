package com.ufps.Universal.Latin.De.Servicios.S.A.S.service;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO.EmpleadoUpdateDto;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Empleado;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.repository.EmpleadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class EmpleadoPerfilService {

    @Autowired
    private EmpleadoRepository empleadoRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Obtiene la información del perfil del empleado
     */
    public Optional<Empleado> obtenerPerfil(String cedula) {
        return empleadoRepository.findById(cedula);
    }

    /**
     * Actualiza la información del perfil del empleado
     */
    @Transactional
    public Empleado actualizarPerfil(String cedula, EmpleadoUpdateDto dto) {
        Empleado empleado = empleadoRepository.findById(cedula)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

        // Actualizar solo los campos que vienen en el DTO (no nulos)
        if (dto.getTelefono() != null && !dto.getTelefono().isEmpty()) {
            empleado.setTelefono(dto.getTelefono());
        }

        if (dto.getEmail() != null && !dto.getEmail().isEmpty()) {
            empleado.setEmail(dto.getEmail());
        }

        if (dto.getDireccion() != null && !dto.getDireccion().isEmpty()) {
            // empleado.setDireccion(dto.getDireccion());
            // Descomenta si tienes el campo direccion en Usuario
        }

        if (dto.getHojaDeVidaUrl() != null && !dto.getHojaDeVidaUrl().isEmpty()) {
            empleado.setHojaDeVidaUrl(dto.getHojaDeVidaUrl());
        }

        // Actualizar contraseña solo si se proporciona
        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            empleado.setPassword(dto.getPassword());
            empleado.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
        }

        return empleadoRepository.save(empleado);
    }

    /**
     * Actualiza solo la URL de la hoja de vida
     */
    @Transactional
    public Empleado actualizarHojaDeVida(String cedula, String hojaDeVidaUrl) {
        Empleado empleado = empleadoRepository.findById(cedula)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

        empleado.setHojaDeVidaUrl(hojaDeVidaUrl);
        return empleadoRepository.save(empleado);
    }

    /**
     * Cambia la contraseña del empleado
     */
    @Transactional
    public void cambiarPassword(String cedula, String passwordActual, String passwordNueva) {
        Empleado empleado = empleadoRepository.findById(cedula)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

        // Verificar que la contraseña actual sea correcta
        if (!passwordEncoder.matches(passwordActual, empleado.getPasswordHash())) {
            throw new RuntimeException("Contraseña actual incorrecta");
        }

        // Actualizar a la nueva contraseña
        empleado.setPassword(passwordNueva);
        empleado.setPasswordHash(passwordEncoder.encode(passwordNueva));
        empleadoRepository.save(empleado);
    }
}