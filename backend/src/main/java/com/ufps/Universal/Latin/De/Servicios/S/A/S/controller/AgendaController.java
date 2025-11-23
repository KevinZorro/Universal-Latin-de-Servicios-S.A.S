package com.ufps.Universal.Latin.De.Servicios.S.A.S.controller;


import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Agenda;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.service.AgendaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/agenda")
@RequiredArgsConstructor
public class AgendaController {

    private final AgendaService agendaService;

    @PostMapping("/crear")
    public ResponseEntity<?> crear(
            @RequestParam Integer orden,
            @RequestParam String empleado,
            @RequestParam LocalDateTime inicio,
            @RequestParam LocalDateTime fin
    ) {
        Agenda a = agendaService.crearOrdenAgenda(orden, empleado, inicio, fin);
        return ResponseEntity.ok("Orden creada exitosamente");
    }

    @PutMapping("/modificar/{id}")
    public ResponseEntity<?> modificar(
            @PathVariable Integer id,
            @RequestParam LocalDateTime inicio,
            @RequestParam LocalDateTime fin
    ) {
        agendaService.modificarAgenda(id, inicio, fin);
        return ResponseEntity.ok("Orden modificada exitosamente");
    }

    @DeleteMapping("/cancelar/{id}")
    public ResponseEntity<?> cancelar(@PathVariable Integer id) {
        agendaService.cancelarAgenda(id);
        return ResponseEntity.ok("Orden eliminada exitosamente");
    }
}