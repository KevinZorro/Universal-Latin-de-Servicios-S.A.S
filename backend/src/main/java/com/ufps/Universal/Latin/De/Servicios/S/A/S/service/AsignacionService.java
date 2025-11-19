package com.ufps.Universal.Latin.De.Servicios.S.A.S.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Map;
import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.Date;


import org.springframework.stereotype.Service;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO.AsignacionDto;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO.EventoAgendaDto;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO.OrdenServicioDto;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO.OrdenesPorEstadoDto;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Asignacion;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Empleado;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Orden_Servicio;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.repository.AsignacionRepository;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.service.EmpleadoService;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.service.OrdenServicioService;

@Service
public class AsignacionService {

    private final AsignacionRepository asignacionRepository;
    private final EmpleadoService empleadoService;
    private final OrdenServicioService ordenServicioService;

    public AsignacionService(
            AsignacionRepository asignacionRepository,
            EmpleadoService empleadoService,
            OrdenServicioService ordenServicioService) {
        this.asignacionRepository = asignacionRepository;
        this.empleadoService = empleadoService;
        this.ordenServicioService = ordenServicioService;
    }

    public List<AsignacionDto> findAllDtos() {
        return asignacionRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public AsignacionDto findDtoById(int id) {
        return asignacionRepository.findById(id)
                .map(this::toDto)
                .orElse(null);
    }

    public AsignacionDto saveByDto(AsignacionDto dto) {
        Asignacion asignacion = new Asignacion();

        // Mapea y valida Orden
        System.out.println("AsignacionService: Buscando Orden_Servicio con ID=" + dto.getOrdenServicioId()); // depuración
        Orden_Servicio orden = ordenServicioService.findById(dto.getOrdenServicioId())
                .orElse(null);
        System.out.println("AsignacionService: Orden_Servicio=" + orden); // depuración
        asignacion.setOrden(orden);

        // Mapea y valida Empleado
        Empleado empleado = empleadoService.obtenerEmpleadoPorId(dto.getEmpleadoId());
        System.out.println("AsignacionService: Empleado=" + empleado); // depuración
        asignacion.setEmpleado(empleado);

        System.out.println("AsignacionService: Fecha=" + dto.getFechaAsignacion()); // depuración
        asignacion.setFechaAsignacion(dto.getFechaAsignacion());

        // Antes de guardar, depura todos los datos
        System.out.println("AsignacionService: asignacion=" + asignacion);

        if (asignacion.getOrden() == null)
            throw new IllegalArgumentException("Orden no encontrada");
        if (asignacion.getEmpleado() == null)
            throw new IllegalArgumentException("Empleado no encontrado");
        if (asignacion.getFechaAsignacion() == null)
            throw new IllegalArgumentException("Fecha Asignacion vacía");

        Asignacion saved = asignacionRepository.save(asignacion);
        return toDto(saved);
    }

public List<EventoAgendaDto> obtenerEventosAgendaPorEmpleado(Empleado empleado) {
    return asignacionRepository.findByEmpleado(empleado).stream()
        .map(asignacion -> {
            EventoAgendaDto dto = new EventoAgendaDto();
            dto.setFechaInicio(formatearFecha(asignacion.getFechaAsignacion()));
            
            Date fechaFin = null;
            if (asignacion.getOrden() != null && asignacion.getOrden().getOrden() != null) {
                fechaFin = asignacion.getOrden().getOrden().getFechaFin();
                dto.setCliente(asignacion.getOrden().getOrden().getCliente().getNombre());
                dto.setUbicacion(asignacion.getOrden().getOrden().getCliente().getDireccion());
            }
            dto.setFechaFin(formatearFecha(fechaFin));
            dto.setEstado(asignacion.getOrden() != null ? asignacion.getOrden().getEstado().name() : "DESCONOCIDO");
            return dto;
        })
        .collect(Collectors.toList());
}


    public void deleteById(int id) {
        asignacionRepository.deleteById(id);
    }

    public OrdenesPorEstadoDto obtenerOrdenesPorEmpleadoAgrupadasPorEstado(Empleado empleado) {
        List<Asignacion> asignaciones = asignacionRepository.findByEmpleado(empleado);

        // Mapear a DTOs
        List<OrdenServicioDto> ordenDtos = asignaciones.stream()
                .map(asignacion -> {
                    OrdenServicioDto dto = new OrdenServicioDto();
                    dto.setId(asignacion.getOrden().getId());
                    dto.setServicioId(
                            asignacion.getOrden().getServicio() != null ? asignacion.getOrden().getServicio().getId()
                                    : null);
                    dto.setOrdenId(
                            asignacion.getOrden().getOrden() != null ? asignacion.getOrden().getOrden().getIdOrden()
                                    : null);
                    dto.setEstado(asignacion.getOrden().getEstado() != null ? asignacion.getOrden().getEstado().name()
                            : null);
                    return dto;
                })
                .collect(Collectors.toList());

        // Agrupar por estado
        Map<String, List<OrdenServicioDto>> agrupado = ordenDtos.stream()
                .collect(Collectors.groupingBy(dto -> dto.getEstado() != null ? dto.getEstado() : "DESCONOCIDO"));

        // Construir DTO respuesta
        return OrdenesPorEstadoDto.builder()
                .pendientes(agrupado.getOrDefault("PENDIENTE", Collections.emptyList()))
                .enProceso(agrupado.getOrDefault("EN_PROCESO", Collections.emptyList()))
                .finalizados(agrupado.getOrDefault("FINALIZADO", Collections.emptyList()))
                .cancelados(agrupado.getOrDefault("CANCELADO", Collections.emptyList()))
                .build();
    }

    private AsignacionDto toDto(Asignacion asignacion) {
        AsignacionDto dto = new AsignacionDto();
        dto.setId(asignacion.getId());
        dto.setOrdenServicioId(asignacion.getOrden() != null ? asignacion.getOrden().getId() : null);
        dto.setEmpleadoId(asignacion.getEmpleado() != null ? asignacion.getEmpleado().getCedula() : null);
        dto.setFechaAsignacion(asignacion.getFechaAsignacion());
        return dto;
    }

    private String formatearFecha(Date fecha) {
    if (fecha == null) return null;
    return new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss").format(fecha);
}

}
