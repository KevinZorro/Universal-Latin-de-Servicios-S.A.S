package com.ufps.Universal.Latin.De.Servicios.S.A.S.service;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO.AgendaResponseDto;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Agenda;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Empleado;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Orden;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.repository.AgendaRepository;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.repository.EmpleadoRepository;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.repository.OrdenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AgendaService {

    private final AgendaRepository agendaRepository;
    private final EmpleadoRepository empleadoRepository;
    private final OrdenRepository ordenRepository;

    // =========================================================================
    // CREAR
    // =========================================================================
    public Agenda crearOrdenAgenda(Integer idOrden, String cedulaEmpleado,
                                   LocalDateTime inicio, LocalDateTime fin) {

        Empleado empleado = empleadoRepository.findById(cedulaEmpleado)
                .orElseThrow(() -> new IllegalArgumentException("Empleado no encontrado"));

        Orden orden = ordenRepository.findById(idOrden)
                .orElseThrow(() -> new IllegalArgumentException("Orden no encontrada"));

        // Validar solapamiento
        List<Agenda> conflictos = agendaRepository.verificarDisponibilidad(
                cedulaEmpleado, inicio, fin);

        if (!conflictos.isEmpty()) {
            throw new IllegalStateException("El empleado ya tiene una orden asignada en ese horario");
        }

        Agenda agenda = new Agenda();
        agenda.setEmpleado(empleado);
        agenda.setOrden(orden);
        agenda.setFechaInicio(inicio);
        agenda.setFechaFin(fin);

        return agendaRepository.save(agenda);
    }

    // =========================================================================
    // MODIFICAR FECHAS
    // =========================================================================
    public Agenda modificarFechas(Integer id, LocalDateTime nuevoInicio, LocalDateTime nuevoFin) {
        Agenda agenda = agendaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Agenda no encontrada"));

        List<Agenda> conflictos = agendaRepository.verificarDisponibilidad(
                agenda.getEmpleado().getCedula(), nuevoInicio, nuevoFin);

        conflictos.removeIf(a -> a.getId().equals(id));

        if (!conflictos.isEmpty()) {
            throw new IllegalStateException("El empleado tiene otra orden en ese horario");
        }

        agenda.setFechaInicio(nuevoInicio);
        agenda.setFechaFin(nuevoFin);

        return agendaRepository.save(agenda);
    }

    // =========================================================================
    // REASIGNAR EMPLEADO
    // =========================================================================
    public Agenda reasignarEmpleado(Integer idAgenda, String nuevaCedulaEmpleado) {

        Agenda agenda = agendaRepository.findById(idAgenda)
                .orElseThrow(() -> new IllegalArgumentException("Agenda no encontrada"));

        Empleado nuevoEmpleado = empleadoRepository.findById(nuevaCedulaEmpleado)
                .orElseThrow(() -> new IllegalArgumentException("Empleado no encontrado"));

        List<Agenda> conflictos = agendaRepository.verificarDisponibilidad(
                nuevaCedulaEmpleado,
                agenda.getFechaInicio(),
                agenda.getFechaFin()
        );

        if (!conflictos.isEmpty()) {
            throw new IllegalStateException("El empleado nuevo NO está disponible en ese horario");
        }

        agenda.setEmpleado(nuevoEmpleado);
        return agendaRepository.save(agenda);
    }

    // =========================================================================
    // CANCELAR
    // =========================================================================
    public void cancelarAgenda(Integer id) {
        Agenda agenda = agendaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Agenda no encontrada"));

        agenda.setActiva(false);
        agendaRepository.save(agenda);
    }

    // =========================================================================
    // LISTAR TODAS
    // =========================================================================
    public List<AgendaResponseDto> listarTodas() {
        return agendaRepository.findAll()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    // =========================================================================
    // LISTAR POR EMPLEADO
    // =========================================================================
    public List<AgendaResponseDto> listarPorEmpleado(String cedulaEmpleado) {
        return agendaRepository.findAll()
                .stream()
                .filter(a -> a.getEmpleado().getCedula().equals(cedulaEmpleado))
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    // =========================================================================
    // Conversión Agenda → DTO
    // =========================================================================
    private AgendaResponseDto toDto(Agenda a) {
        AgendaResponseDto dto = new AgendaResponseDto();
        dto.setId(a.getId());
        dto.setOrdenId(a.getOrden().getIdOrden());
        dto.setEmpleadoCedula(a.getEmpleado().getCedula());
        dto.setEmpleadoNombre(a.getEmpleado().getNombre() + " " + a.getEmpleado().getApellido());
        dto.setFechaInicio(a.getFechaInicio());
        dto.setFechaFin(a.getFechaFin());
        dto.setActiva(a.isActiva());
        return dto;
    }
}
