package com.ufps.Universal.Latin.De.Servicios.S.A.S.controller;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO.OrdenServicioDto;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.OrdenServicio;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.service.OrdenServicioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ordenes-servicio")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class OrdenServicioController {

    private final OrdenServicioService ordenServicioService;

    // Obtener todas las órdenes de servicio
    @GetMapping
    public ResponseEntity<List<OrdenServicio>> getAllOrdenesServicio() {
        List<OrdenServicio> ordenesServicio = ordenServicioService.obtenerTodos();
        return ResponseEntity.ok(ordenesServicio);
    }

    // Obtener una orden de servicio por ID
    @GetMapping("/{id}")
    public ResponseEntity<OrdenServicio> getOrdenServicioById(@PathVariable Integer id) {
        try {
            OrdenServicio ordenServicio = ordenServicioService.obtenerPorId(id)
                    .orElseThrow(() -> new IllegalArgumentException("No existe la orden de servicio"));
            return ResponseEntity.ok(ordenServicio);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Obtener órdenes de servicio por orden
    @GetMapping("/orden/{idOrden}")
    public ResponseEntity<List<OrdenServicio>> getOrdenesServicioPorOrden(@PathVariable Integer idOrden) {
        List<OrdenServicio> ordenesServicio = ordenServicioService.obtenerPorOrden(idOrden);
        return ResponseEntity.ok(ordenesServicio);
    }

    // Obtener órdenes de servicio por servicio
    @GetMapping("/servicio/{idServicio}")
    public ResponseEntity<List<OrdenServicio>> getOrdenesServicioPorServicio(@PathVariable Integer idServicio) {
        List<OrdenServicio> ordenesServicio = ordenServicioService.obtenerPorServicio(idServicio);
        return ResponseEntity.ok(ordenesServicio);
    }

    // Obtener órdenes de servicio por empleado
    @GetMapping("/empleado/{idEmpleado}")
    public ResponseEntity<List<OrdenServicio>> getOrdenesServicioPorEmpleado(@PathVariable Integer idEmpleado) {
        List<OrdenServicio> ordenesServicio = ordenServicioService.obtenerPorEmpleado(idEmpleado);
        return ResponseEntity.ok(ordenesServicio);
    }

    // Obtener órdenes de servicio por estado
    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<OrdenServicio>> getOrdenesServicioPorEstado(@PathVariable String estado) {
        List<OrdenServicio> ordenesServicio = ordenServicioService.obtenerPorEstado(estado);
        return ResponseEntity.ok(ordenesServicio);
    }

    // Crear orden de servicio
    @PostMapping("/crear")
    @PreAuthorize("hasAnyAuthority('GERENTE', 'EMPLEADO')")
    public ResponseEntity<OrdenServicio> createOrdenServicio(@Valid @RequestBody OrdenServicioDto dto) {
        try {
            OrdenServicio nueva = ordenServicioService.crearOrdenServicio(
                    dto.getIdServicio(),
                    dto.getIdOrden(),
                    dto.getIdEmpleadoAsignado(),
                    dto.getEstado());
            return ResponseEntity.ok(nueva);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Actualizar orden de servicio
    @PutMapping("/actualizar/{id}")
    @PreAuthorize("hasAnyAuthority('GERENTE', 'EMPLEADO')")
    public ResponseEntity<OrdenServicio> updateOrdenServicio(@PathVariable Integer id,
            @Valid @RequestBody OrdenServicioDto dto) {
        try {
            OrdenServicio actualizada = ordenServicioService.actualizarOrdenServicio(
                    id,
                    dto.getIdServicio(),
                    dto.getIdOrden(),
                    dto.getIdEmpleadoAsignado(),
                    dto.getEstado()).orElseThrow(() -> new IllegalArgumentException("No existe la orden de servicio"));
            return ResponseEntity.ok(actualizada);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Eliminar orden de servicio
    @DeleteMapping("/eliminar/{id}")
    @PreAuthorize("hasAuthority('GERENTE')")
    public ResponseEntity<Void> deleteOrdenServicio(@PathVariable Integer id) {
        try {
            ordenServicioService.eliminarOrdenServicio(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}