package com.ufps.Universal.Latin.De.Servicios.S.A.S.controller;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO.AgendaResponseDto;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO.CrearAgendaDto;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO.ModificarAgendaDto;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Agenda;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.service.AgendaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/agenda")
@RequiredArgsConstructor
public class AgendaController {

    private final AgendaService agendaService;

    // ==========================
    // 🔹 CREAR ORDEN EN AGENDA
    // ==========================
    @PostMapping("/crear")
    public ResponseEntity<?> crear(@RequestBody CrearAgendaDto dto) {
        agendaService.crearOrdenAgenda(
                dto.getOrdenId(),
                dto.getEmpleadoCedula(),
                dto.getFechaInicio(),
                dto.getFechaFin()
        );
        return ResponseEntity.ok("Orden creada exitosamente");
    }

    // ==========================
    // 🔹 MODIFICAR FECHAS
    // ==========================
    @PutMapping("/{id}/fechas")
    public ResponseEntity<?> modificarFechas(
            @PathVariable Integer id,
            @RequestBody ModificarAgendaDto dto
    ) {
        agendaService.modificarFechas(id, dto.getNuevoInicio(), dto.getNuevoFin());
        return ResponseEntity.ok("Fechas actualizadas exitosamente");
    }

    // ==========================
    // 🔹 REASIGNAR EMPLEADO
    // ==========================
    @PutMapping("/{id}/empleado")
    public ResponseEntity<?> reasignarEmpleado(
            @PathVariable Integer id,
            @RequestBody ModificarAgendaDto dto
    ) {
        agendaService.reasignarEmpleado(id, dto.getNuevoEmpleadoCedula());
        return ResponseEntity.ok("Empleado reasignado exitosamente");
    }

    // ==========================
    // 🔹 CANCELAR AGENDA
    // ==========================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelar(@PathVariable Integer id) {
        agendaService.cancelarAgenda(id);
        return ResponseEntity.ok("Orden cancelada exitosamente");
    }

    // ==========================
    // 🔹 LISTAR TODA LA AGENDA
    // ==========================
    @GetMapping
    public ResponseEntity<List<AgendaResponseDto>> listarTodas() {
        return ResponseEntity.ok(agendaService.listarTodas());
    }

    // ==========================
    // 🔹 LISTAR POR EMPLEADO
    // ==========================
    @GetMapping("/empleado/{cedula}")
    public ResponseEntity<List<AgendaResponseDto>> listarPorEmpleado(@PathVariable String cedula) {
        return ResponseEntity.ok(agendaService.listarPorEmpleado(cedula));
    }
}
