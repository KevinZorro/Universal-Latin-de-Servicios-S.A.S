package com.ufps.Universal.Latin.De.Servicios.S.A.S.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO.CandidatoDto;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO.CandidatoRegistroDto;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Candidato;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.EstadoProceso;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.service.CandidatoService;
import org.springframework.http.MediaType;

@RestController
@RequestMapping("/api/candidatos")
public class CandidatoController {

    private final CandidatoService candidatoService;

    public CandidatoController(CandidatoService candidatoService) {
        this.candidatoService = candidatoService;
    }

    // ===============================
    // LISTAR TODOS
    // ===============================
    @GetMapping
    public List<CandidatoDto> getAllCandidatos() {
        return candidatoService.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    // ===============================
    // OBTENER POR CÉDULA
    // ===============================
    @GetMapping("/{id}")
    public CandidatoDto getCandidatoById(@PathVariable String id) {
        Optional<Candidato> candidato = candidatoService.findByCedula(id);
        return candidato.map(this::toDto)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Candidato no encontrado"));
    }

    // ===============================
    // REGISTRAR CANDIDATO (SOLO JSON)
    // ===============================
    @PostMapping(value = "/registrar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> registrarCandidato(
            @RequestPart("candidato") CandidatoRegistroDto dto,
            @RequestPart("hojaDeVida") MultipartFile hojaDeVida) {

        try {
            candidatoService.registrarCandidato(dto, hojaDeVida);
            return ResponseEntity.ok("{\"message\": \"Candidato registrado exitosamente\"}");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\": \"Error al registrar: " + e.getMessage() + "\"}");
        }
    }

    // ===============================
    // ELIMINAR
    // ===============================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCandidato(@PathVariable String id) {
        try {
            candidatoService.deleteById(id);
            return ResponseEntity.ok("{\"message\": \"Candidato eliminado\"}");

        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Candidato no encontrado");
        }
    }

    // ===============================
    // CAMBIAR ESTADO
    // ===============================
    @PatchMapping("/{id}/estado/{nuevoEstado}")
    public ResponseEntity<?> cambiarEstado(
            @PathVariable String id,
            @PathVariable String nuevoEstado) {

        try {
            Candidato actualizado = candidatoService.cambiarEstado(id, nuevoEstado);
            return ResponseEntity.ok(toDto(actualizado));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    // ===============================
    // FILTRAR POR ESTADO
    // ===============================
    @GetMapping("/estado/{estado}")
    public List<CandidatoDto> filtrarPorEstado(@PathVariable String estado) {

        try {
            EstadoProceso ep = EstadoProceso.valueOf(estado.toUpperCase());
            return candidatoService.findByEstado(ep)
                    .stream()
                    .map(this::toDto)
                    .toList();

        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Estado inválido. Use: APROBADO, RECHAZADO, EN_REVISION");
        }
    }

    // ===============================
    // AUXILIARES
    // ===============================
    private CandidatoDto toDto(Candidato candidato) {
        CandidatoDto dto = new CandidatoDto();

        dto.setCedula(candidato.getCedula());
        dto.setNombre(candidato.getNombre());
        dto.setApellido(candidato.getApellido());
        dto.setEmail(candidato.getEmail());
        dto.setTelefono(candidato.getTelefono());

        dto.setPosicion(candidato.getPosicion());
        dto.setExperiencia(candidato.getExperiencia());
        dto.setMensaje(candidato.getMensaje());
        dto.setEstadoProceso(candidato.getEstadoProceso());
        dto.setHojaDeVidaURL(candidato.getHojaDeVidaURL());
        dto.setRol(candidato.getRol());

        return dto;
    }
}
