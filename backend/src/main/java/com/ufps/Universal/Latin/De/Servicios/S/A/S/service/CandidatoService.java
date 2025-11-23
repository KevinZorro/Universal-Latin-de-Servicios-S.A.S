package com.ufps.Universal.Latin.De.Servicios.S.A.S.service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO.CandidatoRegistroDto;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Candidato;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Rol;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.repository.CandidatoRepository;

@Service
public class CandidatoService {

    private final CandidatoRepository candidatoRepository;
    private final SupabaseStorageService supabaseStorageService;
    private final PasswordEncoder passwordEncoder;

    public CandidatoService(
            CandidatoRepository candidatoRepository,
            SupabaseStorageService supabaseStorageService,
            PasswordEncoder passwordEncoder) {

        this.candidatoRepository = candidatoRepository;
        this.supabaseStorageService = supabaseStorageService;
        this.passwordEncoder = passwordEncoder;
    }

    public Optional<Candidato> findByCedula(String cedula) {
        return candidatoRepository.findById(cedula);
    }

    public List<Candidato> findAll() {
        return candidatoRepository.findAll();
    }

    public void deleteById(String id) {
        candidatoRepository.deleteById(id);
    }

    // ---------------------------------------------------------
    //  ✔ Registrar candidato con subida de hoja de vida a Supabase
    // ---------------------------------------------------------
    public Candidato registrarCandidato(CandidatoRegistroDto dto, MultipartFile hojaDeVidaFile)
            throws IOException {

        if (hojaDeVidaFile == null || hojaDeVidaFile.isEmpty()) {
            throw new IOException("La hoja de vida es obligatoria");
        }

        // 1️⃣ Subir archivo a Supabase
        String urlPublica = supabaseStorageService.uploadImage(
                hojaDeVidaFile.getBytes(),
                hojaDeVidaFile.getOriginalFilename()
        );

        // 2️⃣ Crear entidad candidato
        Candidato candidato = new Candidato();

        // --- Datos heredados de Usuario ---
        candidato.setCedula(dto.getCedula());
        candidato.setNombre(dto.getNombre());
        candidato.setApellido(dto.getApellido());
        candidato.setEmail(dto.getEmail());
        candidato.setTelefono(dto.getTelefono());
        candidato.setRol(Rol.CANDIDATO);

        // Asignar password por defecto
        candidato.setPasswordHash(passwordEncoder.encode("defaultPassword123"));

        // --- Datos propios de Candidato ---
        candidato.setPosicion(dto.getPosicion());
        candidato.setExperiencia(dto.getExperiencia());
        candidato.setMensaje(dto.getMensaje());
        candidato.setHojaDeVidaURL(urlPublica); // 📌 URL del archivo en Supabase
        candidato.setEstadoProceso(false);

        // 3️⃣ Guardar en DB
        return candidatoRepository.save(candidato);
    }
}
