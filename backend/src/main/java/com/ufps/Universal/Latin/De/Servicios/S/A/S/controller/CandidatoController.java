package com.ufps.Universal.Latin.De.Servicios.S.A.S.controller;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO.CandidatoDto;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Candidato;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.service.CandidatoService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/candidatos")
public class CandidatoController {

    private final CandidatoService candidatoService;

    public CandidatoController(CandidatoService candidatoService) {
        this.candidatoService = candidatoService;
    }

    @GetMapping
    public List<CandidatoDto> getAllCandidatos() {
        return candidatoService.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public CandidatoDto getCandidatoById(@PathVariable String id) {
        Optional<Candidato> candidato = candidatoService.findByCedula(id);
        return candidato.map(this::toDto).orElse(null);
    }

    @PostMapping
    public CandidatoDto createCandidato(@RequestBody CandidatoDto dto) {
        Candidato entity = toEntity(dto);
        Candidato saved = candidatoService.save(entity);
        return toDto(saved);
    }

    @DeleteMapping("/{id}")
    public void deleteCandidato(@PathVariable String id) {
        candidatoService.deleteById(id);
    }

    // Auxiliares de conversión
    private CandidatoDto toDto(Candidato candidato) {
        CandidatoDto dto = new CandidatoDto();
        dto.setHojaDeVidaURL(candidato.getHojaDeVidaURL());
        dto.setEstadoProceso(candidato.isEstadoProceso());
        // hereda campos de Usuario: cédula, nombre, etc.
        dto.setCedula(candidato.getCedula());
        dto.setTelefono(candidato.getTelefono());
        dto.setEmail(candidato.getEmail());
        dto.setApellido(candidato.getApellido());
        dto.setNombre(candidato.getNombre());
        dto.setRol(candidato.getRol().name());
        return dto;
    }

    private Candidato toEntity(CandidatoDto dto) {
        Candidato entity = new Candidato();
        entity.setHojaDeVidaURL(dto.getHojaDeVidaURL());
        entity.setEstadoProceso(dto.isEstadoProceso());
        // hereda campos de Usuario: cédula, nombre, etc.
        entity.setCedula(dto.getCedula());
        entity.setTelefono(dto.getTelefono());
        entity.setEmail(dto.getEmail());
        entity.setApellido(dto.getApellido());
        entity.setNombre(dto.getNombre());
        entity.setRol(com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Rol.valueOf(dto.getRol()));
        return entity;
    }
}
