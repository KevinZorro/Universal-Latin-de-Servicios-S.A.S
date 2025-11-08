package com.ufps.Universal.Latin.De.Servicios.S.A.S.controller;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO.EvidenciaDto;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Evidencia;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Orden_Servicio;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.service.EvidenciaService;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.service.OrdenServicioService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/evidencias")
public class EvidenciaController {

    private final EvidenciaService evidenciaService;
    private final OrdenServicioService ordenServicioService;

    public EvidenciaController(EvidenciaService evidenciaService, OrdenServicioService ordenServicioService) {
        this.evidenciaService = evidenciaService;
        this.ordenServicioService = ordenServicioService;
    }

    @GetMapping
    public List<EvidenciaDto> getAllEvidencias() {
        return evidenciaService.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{idEvidencia}")
    public EvidenciaDto getEvidenciaById(@PathVariable int idEvidencia) {
        Optional<Evidencia> evidencia = evidenciaService.findById(idEvidencia);
        return evidencia.map(this::toDto).orElse(null);
    }

    @PostMapping
    public EvidenciaDto createEvidencia(@RequestBody EvidenciaDto dto) {
        Evidencia entity = toEntity(dto);
        Evidencia saved = evidenciaService.save(entity);
        return toDto(saved);
    }

    @DeleteMapping("/{idEvidencia}")
    public void deleteEvidencia(@PathVariable int idEvidencia) {
        evidenciaService.deleteById(idEvidencia);
    }

    // Auxiliares
    private EvidenciaDto toDto(Evidencia evidencia) {
        EvidenciaDto dto = new EvidenciaDto();
        dto.setIdEvidencia(evidencia.getIdEvidencia());
        dto.setOrdenServicioId(evidencia.getOrdenServicio() != null ? evidencia.getOrdenServicio().getId() : null);
        dto.setDescripcion(evidencia.getDescripcion());
        dto.setTipoArchivo(evidencia.getTipoArchivo());
        dto.setRutaArchivo(evidencia.getRutaArchivo());
        dto.setFechaRegistro(evidencia.getFechaRegistro());
        dto.setRegistradaPor(evidencia.getRegistradaPor());
        return dto;
    }

    private Evidencia toEntity(EvidenciaDto dto) {
        Evidencia evidencia = new Evidencia();
        evidencia.setIdEvidencia(dto.getIdEvidencia());
        if (dto.getOrdenServicioId() != 0) {
            Optional<Orden_Servicio> ordenOpt = ordenServicioService.findById(dto.getOrdenServicioId());
            ordenOpt.ifPresent(evidencia::setOrdenServicio);
        }
        evidencia.setDescripcion(dto.getDescripcion());
        evidencia.setTipoArchivo(dto.getTipoArchivo());
        evidencia.setRutaArchivo(dto.getRutaArchivo());
        evidencia.setFechaRegistro(dto.getFechaRegistro());
        evidencia.setRegistradaPor(dto.getRegistradaPor());
        return evidencia;
    }
}
