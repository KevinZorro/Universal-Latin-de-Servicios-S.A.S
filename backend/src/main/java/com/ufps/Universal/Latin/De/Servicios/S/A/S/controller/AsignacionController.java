package com.ufps.Universal.Latin.De.Servicios.S.A.S.controller;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO.AsignacionDto;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO.OrdenesPorEstadoDto;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Asignacion;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Orden_Servicio;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Empleado;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.service.AsignacionService;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.service.OrdenServicioService;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.service.EmpleadoService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/asignaciones")
public class AsignacionController {

    private final AsignacionService asignacionService;
    private final OrdenServicioService ordenServicioService;
    private final EmpleadoService empleadoService;

    public AsignacionController(AsignacionService asignacionService, 
                                OrdenServicioService ordenServicioService,
                                EmpleadoService empleadoService) {
        this.asignacionService = asignacionService;
        this.ordenServicioService = ordenServicioService;
        this.empleadoService = empleadoService;
    }

    @GetMapping
    public List<AsignacionDto> getAllAsignaciones() {
        return asignacionService.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public AsignacionDto getAsignacionById(@PathVariable int id) {
        Optional<Asignacion> asignacion = asignacionService.findById(id);
        return asignacion.map(this::toDto).orElse(null);
    }

    @PostMapping
    public AsignacionDto createAsignacion(@RequestBody AsignacionDto dto) {
        Asignacion entidad = toEntity(dto);
        Asignacion saved = asignacionService.save(entidad);
        return toDto(saved);
    }

    @DeleteMapping("/{id}")
    public void deleteAsignacion(@PathVariable int id) {
        asignacionService.deleteById(id);
    }

    // Métodos auxiliares:
    private AsignacionDto toDto(Asignacion asignacion) {
        AsignacionDto dto = new AsignacionDto();
        dto.setId(asignacion.getId());
        dto.setOrdenServicioId(asignacion.getOrden() != null ? asignacion.getOrden().getId() : null);
        dto.setEmpleadoId(asignacion.getEmpleado() != null ? asignacion.getEmpleado().getCedula() : null);
        dto.setFechaAsignacion(asignacion.getFechaAsignacion());
        return dto;
    }

    private Asignacion toEntity(AsignacionDto dto) {
    Asignacion asignacion = new Asignacion();
    asignacion.setId(dto.getId());

    if (dto.getOrdenServicioId() != 0) {
    Orden_Servicio orden = ordenServicioService.findById(dto.getOrdenServicioId())
            .orElseThrow(() -> new IllegalArgumentException("Orden no encontrada"));
    asignacion.setOrden(orden);
    }


    if (dto.getEmpleadoId() != null && !dto.getEmpleadoId().isEmpty()) {
        Empleado empleado = empleadoService.obtenerEmpleadoPorId(dto.getEmpleadoId());
        asignacion.setEmpleado(empleado);
    }

    asignacion.setFechaAsignacion(dto.getFechaAsignacion());
    return asignacion;
}

    @GetMapping("/empleado/{empleadoId}")
    public OrdenesPorEstadoDto obtenerTrabajosPorEmpleado(@PathVariable String empleadoId) {
        Empleado empleado = empleadoService.obtenerEmpleadoPorId(empleadoId);
        if (empleado == null) {
            throw new RuntimeException("Empleado no encontrado");
        }
        return asignacionService.obtenerOrdenesPorEmpleadoAgrupadasPorEstado(empleado);
    }
}