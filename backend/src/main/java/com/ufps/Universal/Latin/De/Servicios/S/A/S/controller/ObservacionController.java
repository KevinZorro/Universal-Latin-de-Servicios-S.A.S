package com.ufps.Universal.Latin.De.Servicios.S.A.S.controller;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO.ObservacionDto;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Observacion;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Orden_Servicio;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Empleado;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.service.ObservacionService;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.service.OrdenServicioService;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.service.EmpleadoService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/observaciones")
@CrossOrigin(origins = "http://localhost:3000")
public class ObservacionController {

    private final ObservacionService observacionService;
    private final OrdenServicioService ordenServicioService;
    private final EmpleadoService empleadoService;

    public ObservacionController(ObservacionService observacionService,
                                 OrdenServicioService ordenServicioService,
                                 EmpleadoService empleadoService) {
        this.observacionService = observacionService;
        this.ordenServicioService = ordenServicioService;
        this.empleadoService = empleadoService;
    }

    @GetMapping
    public List<ObservacionDto> getAllObservaciones() {
        return observacionService.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{idObservacion}")
    public ObservacionDto getObservacionById(@PathVariable int idObservacion) {
        Optional<Observacion> observacion = observacionService.findById(idObservacion);
        return observacion.map(this::toDto).orElse(null);
    }

    @PostMapping
    public ObservacionDto createObservacion(@RequestBody ObservacionDto dto) {
        Observacion entity = toEntity(dto);
        Observacion saved = observacionService.save(entity);
        return toDto(saved);
    }

    @DeleteMapping("/{idObservacion}")
    public void deleteObservacion(@PathVariable int idObservacion) {
        observacionService.deleteById(idObservacion);
    }

    // Auxiliares
    private ObservacionDto toDto(Observacion obs) {
        ObservacionDto dto = new ObservacionDto();
        dto.setIdObservacion(obs.getIdObservacion());
        dto.setOrdenServicioId(obs.getOrden() != null ? obs.getOrden().getId() : null);
        dto.setEmpleadoId(obs.getEmpleado() != null ? obs.getEmpleado().getCedula() : null);
        dto.setFechaObservacion(obs.getFechaObservacion());
        dto.setDescripcion(obs.getDescripcion());
        return dto;
    }

    private Observacion toEntity(ObservacionDto dto) {
        Observacion obs = new Observacion();
        obs.setIdObservacion(dto.getIdObservacion());
        if (dto.getOrdenServicioId() != 0) {
            Optional<Orden_Servicio> ordenOpt = ordenServicioService.findById(dto.getOrdenServicioId());
            ordenOpt.ifPresent(obs::setOrden);
        }
        if (dto.getEmpleadoId().isEmpty()) {
            //Optional<Empleado> empOpt = empleadoService.obtenerEmpleadoPorId(dto.getEmpleadoId());
            //empOpt.ifPresent(obs::setEmpleado);
        }
        obs.setFechaObservacion(dto.getFechaObservacion());
        obs.setDescripcion(dto.getDescripcion());
        return obs;
    }
}
