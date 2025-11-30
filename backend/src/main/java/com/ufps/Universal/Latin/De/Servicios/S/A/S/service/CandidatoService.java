package com.ufps.Universal.Latin.De.Servicios.S.A.S.service;

import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO.CandidatoRegistroDto;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Candidato;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.EstadoProceso;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Rol;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.repository.CandidatoRepository;

@Service
public class CandidatoService {

    private final CandidatoRepository candidatoRepository;
    private final PasswordEncoder passwordEncoder;

    public CandidatoService(
            CandidatoRepository candidatoRepository,
            PasswordEncoder passwordEncoder) {

        this.candidatoRepository = candidatoRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // =============================================
    // LISTAR Y OBTENER
    // =============================================
    public Optional<Candidato> findByCedula(String cedula) {
        return candidatoRepository.findById(cedula);
    }

    public List<Candidato> findAll() {
        return candidatoRepository.findAll();
    }

    public void deleteById(String id) {
        candidatoRepository.deleteById(id);
    }

    // =============================================
    // REGISTRAR CANDIDATO (solo JSON, sin PDF)
    // =============================================
    public Candidato registrarCandidato(CandidatoRegistroDto dto) {

        Candidato candidato = new Candidato();
        candidato.setCedula(dto.getCedula());
        candidato.setNombre(dto.getNombre());
        candidato.setApellido(dto.getApellido());
        candidato.setEmail(dto.getEmail());
        candidato.setTelefono(dto.getTelefono());
        candidato.setRol(Rol.CANDIDATO);

        // Contraseña por defecto
        candidato.setPasswordHash(passwordEncoder.encode("defaultPassword123"));

        candidato.setPosicion(dto.getPosicion());
        candidato.setExperiencia(dto.getExperiencia());
        candidato.setMensaje(dto.getMensaje());

        // No hay hoja de vida
        candidato.setHojaDeVidaURL(null);

        // Estado inicial
        candidato.setEstadoProceso(EstadoProceso.EN_REVISION);

        return candidatoRepository.save(candidato);
    }

    // =============================================
    // CAMBIAR ESTADO DEL PROCESO
    // =============================================
    public Candidato cambiarEstado(String cedula, String nuevoEstado) {

        Candidato candidato = candidatoRepository.findById(cedula)
                .orElseThrow(() -> new RuntimeException("Candidato no encontrado"));

        EstadoProceso estado;

        try {
            estado = EstadoProceso.valueOf(nuevoEstado.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Estado no válido. Valores permitidos: APROBADO, RECHAZADO, EN_REVISION");
        }

        candidato.setEstadoProceso(estado);
        return candidatoRepository.save(candidato);
    }

    // =============================================
    // FILTRAR POR ESTADO
    // =============================================
    public List<Candidato> findByEstado(EstadoProceso estado) {
        return candidatoRepository.findAll().stream()
                .filter(c -> c.getEstadoProceso() == estado)
                .toList();
    }
}
