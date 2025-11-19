package com.ufps.Universal.Latin.De.Servicios.S.A.S.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO.OrdenServicioDto;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO.OrdenesPorEstadoDto;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Asignacion;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Empleado;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.repository.AsignacionRepository;
import java.util.Map;
import java.util.Collections;

@Service
public class AsignacionService {

    private final AsignacionRepository asignacionRepository;

    public AsignacionService(AsignacionRepository asignacionRepository) {
        this.asignacionRepository = asignacionRepository;
    }

    public List<Asignacion> findAll() {
        return asignacionRepository.findAll();
    }

    public Optional<Asignacion> findById(int id) {
        return asignacionRepository.findById(id);
    }

    public Asignacion save(Asignacion asignacion) {
        return asignacionRepository.save(asignacion);
    }

    public void deleteById(int id) {
        asignacionRepository.deleteById(id);
    }

        public OrdenesPorEstadoDto obtenerOrdenesPorEmpleadoAgrupadasPorEstado(Empleado empleado) {
        List<Asignacion> asignaciones = asignacionRepository.findByEmpleado(empleado);

        // Mapear las órdenes asignadas a DTOs
        List<OrdenServicioDto> ordenDtos = asignaciones.stream()
            .map(asignacion -> {
                OrdenServicioDto dto = new OrdenServicioDto();
                dto.setId(asignacion.getOrden().getId());
                dto.setServicioId(asignacion.getOrden().getServicio() != null ? asignacion.getOrden().getServicio().getId() : null);
                dto.setOrdenId(asignacion.getOrden().getOrden() != null ? asignacion.getOrden().getOrden().getIdOrden() : null);
                dto.setEstado(asignacion.getOrden().getEstado() != null ? asignacion.getOrden().getEstado().name() : null);
                return dto;
            })
            .collect(Collectors.toList());

        // Agrupar por estado
        Map<String, List<OrdenServicioDto>> agrupado = ordenDtos.stream()
            .collect(Collectors.groupingBy(dto -> dto.getEstado() != null ? dto.getEstado() : "DESCONOCIDO"));

        // Construir DTO respuesta con listas separadas
        return OrdenesPorEstadoDto.builder()
            .pendientes(agrupado.getOrDefault("PENDIENTE", Collections.emptyList()))
            .enProceso(agrupado.getOrDefault("EN_PROCESO", Collections.emptyList()))
            .finalizados(agrupado.getOrDefault("FINALIZADO", Collections.emptyList()))
            .cancelados(agrupado.getOrDefault("CANCELADO", Collections.emptyList()))
            .build();
    }

}
