package com.ufps.Universal.Latin.De.Servicios.S.A.S.service;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO.CandidatoDto;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO.CandidatoRegistroDto; // <-- Importar DTO nuevo
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Candidato;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Rol; // <-- Importar Rol
import com.ufps.Universal.Latin.De.Servicios.S.A.S.repository.CandidatoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder; // <-- Importar
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile; // <-- Importar

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CandidatoService {

    private final CandidatoRepository candidatoRepository;
    private final FileStorageService fileStorageService; 
    private final PasswordEncoder passwordEncoder;

    public CandidatoService(CandidatoRepository candidatoRepository, 
                            FileStorageService fileStorageService, 
                            PasswordEncoder passwordEncoder) {
        this.candidatoRepository = candidatoRepository;
        this.fileStorageService = fileStorageService;
        this.passwordEncoder = passwordEncoder;
    }

    public Optional<Candidato> findByCedula(String cedula){ return candidatoRepository.findById(cedula);}

    public List<Candidato> findAll() { return candidatoRepository.findAll(); }

    public Candidato save(Candidato candidato) { return candidatoRepository.save(candidato); }

    public void deleteById(String id) { candidatoRepository.deleteById(id); }

    public Candidato registrarCandidato(CandidatoRegistroDto dto, MultipartFile hojaDeVidaFile) {
        
        String nombreArchivo = fileStorageService.store(hojaDeVidaFile);

        Candidato candidato = new Candidato();
        
        // --- Campos de Usuario (Heredados) ---
        candidato.setCedula(dto.getCedula());
        candidato.setNombre(dto.getNombre());     
        candidato.setApellido(dto.getApellido()); 
        candidato.setEmail(dto.getEmail());
        candidato.setTelefono(dto.getTelefono());
        candidato.setRol(Rol.CANDIDATO); 
        candidato.setPasswordHash(passwordEncoder.encode("defaultPassword123")); 

        // --- Campos de Candidato (Propios) ---
        candidato.setPosicion(dto.getPosicion());       
        candidato.setExperiencia(dto.getExperiencia()); 
        candidato.setMensaje(dto.getMensaje());       
        candidato.setHojaDeVidaURL(nombreArchivo); 
        candidato.setEstadoProceso(false); 
        return candidatoRepository.save(candidato);
    }
}
