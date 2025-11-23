package com.ufps.Universal.Latin.De.Servicios.S.A.S.service;


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

@Service
@RequiredArgsConstructor
public class AgendaService {

    private final AgendaRepository agendaRepository;
    private final EmpleadoRepository empleadoRepository;
    private final OrdenRepository ordenRepository;

    // ===================== CREAR ORDEN EN AGENDA =====================
    public Agenda crearOrdenAgenda(Integer idOrden, String cedulaEmpleado, LocalDateTime inicio, LocalDateTime fin) {

        Empleado empleado = empleadoRepository.findById(cedulaEmpleado)
                .orElseThrow(() -> new IllegalArgumentException("Empleado no encontrado"));

        Orden orden = ordenRepository.findById(idOrden)
                .orElseThrow(() -> new IllegalArgumentException("Orden no encontrada"));

        // VALIDAR SOLAPAMIENTOS
        List<Agenda> conflictos = agendaRepository.verificarDisponibilidad(
                cedulaEmpleado, inicio, fin
        );

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

    // ===================== MODIFICAR ORDEN =====================
    public Agenda modificarAgenda(Integer id, LocalDateTime nuevoInicio, LocalDateTime nuevoFin) {
        Agenda agenda = agendaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Agenda no encontrada"));

        // Validar disponibilidad de nuevo
        List<Agenda> conflictos = agendaRepository.verificarDisponibilidad(
                agenda.getEmpleado().getCedula(), nuevoInicio, nuevoFin
        );

        // Excluir la agenda actual de los conflictos
        conflictos.removeIf(a -> a.getId().equals(id));

        if (!conflictos.isEmpty()) {
            throw new IllegalStateException("El empleado tiene otra orden en ese horario");
        }

        agenda.setFechaInicio(nuevoInicio);
        agenda.setFechaFin(nuevoFin);

        return agendaRepository.save(agenda);
    }

    // ===================== CANCELAR =====================
    public void cancelarAgenda(Integer id) {
        Agenda agenda = agendaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Agenda no encontrada"));

        agenda.setActiva(false);

        agendaRepository.save(agenda);
    }
}