package com.ufps.Universal.Latin.De.Servicios.S.A.S.controller;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO.ServicioDto;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Servicio;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.service.ServicioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servicios")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ServicioController {

    private final ServicioService servicioService;

    // Obtener todos los servicios
    @GetMapping
    public ResponseEntity<List<Servicio>> getAllServicios() {
        List<Servicio> servicios = servicioService.obtenerTodos();
        return ResponseEntity.ok(servicios);
    }

    // Obtener un servicio por id
    @GetMapping("/{id}")
    public ResponseEntity<Servicio> getServicioById(@PathVariable int id) {
        try {
            Servicio servicio = servicioService.obtenerPorId(id)
                .orElseThrow(() -> new IllegalArgumentException("No existe el servicio"));
            return ResponseEntity.ok(servicio);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Crear servicio
    @PostMapping("/crear")
    @PreAuthorize("hasAuthority('GERENTE')")
    public ResponseEntity<Servicio> createServicio(@Valid @RequestBody ServicioDto dto) {
        try {
            Servicio nuevo = servicioService.crearServicio(
                    dto.getNombreServicio(),
                    dto.getDescripcion(),
                    dto.isEstado(),
                    dto.getTipoHorario()
            );
            return ResponseEntity.ok(nuevo);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Actualizar servicio
    @PutMapping("/actualizar/{id}")
    @PreAuthorize("hasAuthority('GERENTE')")
    public ResponseEntity<Servicio> updateServicio(@PathVariable int id, @Valid @RequestBody ServicioDto dto) {
        try {
            Servicio actualizado = servicioService.actualizarServicio(
                    id,
                    dto.getNombreServicio(),
                    dto.getDescripcion(),
                    dto.isEstado(),
                    dto.getTipoHorario()
            ).orElseThrow(() -> new IllegalArgumentException("No existe el servicio"));
            return ResponseEntity.ok(actualizado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Eliminar servicio
    @DeleteMapping("/eliminar/{id}")
    @PreAuthorize("hasAuthority('GERENTE')")
    public ResponseEntity<Void> deleteServicio(@PathVariable int id) {
        try {
            servicioService.eliminarServicio(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
