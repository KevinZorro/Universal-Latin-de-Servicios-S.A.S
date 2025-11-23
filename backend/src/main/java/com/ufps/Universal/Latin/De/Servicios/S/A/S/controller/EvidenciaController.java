package com.ufps.Universal.Latin.De.Servicios.S.A.S.controller;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO.EvidenciaDto;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Empleado;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Evidencia;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Orden_Servicio;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.service.EmpleadoService;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.service.EvidenciaService;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.service.OrdenServicioService;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.service.SupabaseStorageService;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.io.IOException;
import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import java.io.File;
import java.util.Date;
import java.util.UUID;

@RestController
@RequestMapping("/api/evidencias")
public class EvidenciaController {

    private final EvidenciaService evidenciaService;
    private final OrdenServicioService ordenServicioService;
    private final EmpleadoService empleadoService;
    private final SupabaseStorageService supabaseStorageService;

    public EvidenciaController(EvidenciaService evidenciaService,
            OrdenServicioService ordenServicioService,
            EmpleadoService empleadoService,
            SupabaseStorageService supabaseStorageService) {

        this.evidenciaService = evidenciaService;
        this.ordenServicioService = ordenServicioService;
        this.empleadoService = empleadoService;
        this.supabaseStorageService = supabaseStorageService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public EvidenciaDto createEvidencia(
            @RequestParam("ordenServicioId") int ordenServicioId,
            @RequestParam("descripcion") String descripcion,
            @RequestParam("horaInicio") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime horaInicio,
            @RequestParam("horaFin") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime horaFin,
            @RequestParam("empleadoId") String empleadoId,
            @RequestPart("imagen") MultipartFile imagen) throws IOException {

        // *** CAMBIO IMPORTANTE ***
        // Guardar imagen en Supabase Storage
        String urlPublica = supabaseStorageService.uploadImage(
                imagen.getBytes(),
                imagen.getOriginalFilename());

        Evidencia evidencia = new Evidencia();

        Optional<Orden_Servicio> ordenOpt = ordenServicioService.findById(ordenServicioId);
        if (!ordenOpt.isPresent())
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Orden de Servicio no encontrada");
        evidencia.setOrdenServicio(ordenOpt.get());

        Empleado empleado = empleadoService.obtenerEmpleadoPorId(empleadoId);
        if (empleado == null)
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Empleado no encontrado");
        evidencia.setRegistradaPor(empleado);

        evidencia.setDescripcion(descripcion);
        evidencia.setHoraInicio(horaInicio);
        evidencia.setHoraFin(horaFin);
        evidencia.setTipoArchivo(imagen.getContentType());
        evidencia.setRutaArchivo(urlPublica);
        evidencia.setFechaRegistro(new Date());

        Evidencia guardada = evidenciaService.save(evidencia);
        return toDto(guardada);
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
        dto.setHoraInicio(evidencia.getHoraInicio());
        dto.setHoraFin(evidencia.getHoraFin());
        dto.setEmpleadoId(
                evidencia.getRegistradaPor() != null ? evidencia.getRegistradaPor().getCedula() : null);

        return dto;
    }

    private Evidencia toEntity(EvidenciaDto dto) {
        Evidencia evidencia = new Evidencia();
        evidencia.setIdEvidencia(dto.getIdEvidencia());
        if (dto.getOrdenServicioId() != 0) {
            Optional<Orden_Servicio> ordenOpt = ordenServicioService.findById(dto.getOrdenServicioId());
            ordenOpt.ifPresent(evidencia::setOrdenServicio);
        }
        if (dto.getEmpleadoId() != null) {
            Empleado empleado = empleadoService.obtenerEmpleadoPorId(dto.getEmpleadoId());
            if (empleado == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Empleado no encontrado");
            }
            evidencia.setRegistradaPor(empleado);
        }

        evidencia.setDescripcion(dto.getDescripcion());
        evidencia.setTipoArchivo(dto.getTipoArchivo());
        evidencia.setRutaArchivo(dto.getRutaArchivo());
        evidencia.setFechaRegistro(dto.getFechaRegistro());
        evidencia.setHoraInicio(dto.getHoraInicio());
        evidencia.setHoraFin(dto.getHoraFin());
        return evidencia;
    }

}
