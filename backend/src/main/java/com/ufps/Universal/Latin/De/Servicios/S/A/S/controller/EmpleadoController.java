package com.ufps.Universal.Latin.De.Servicios.S.A.S.controller;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Cargo;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Empleado;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.service.EmpleadoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/empleados")
@RequiredArgsConstructor
public class EmpleadoController {

    private final EmpleadoService empleadoService;

    // ================== CRUD DE EMPLEADOS ==================

    @GetMapping
    public ResponseEntity<List<Empleado>> getAllEmpleados() {
        List<Empleado> empleados = empleadoService.obtenerTodosEmpleados();
        return ResponseEntity.ok(empleados);
    }

    @GetMapping("/{cedula}")
    public ResponseEntity<Empleado> getEmpleadoById(@PathVariable String cedula) {
        try {
            Empleado empleado = empleadoService.obtenerEmpleadoPorId(cedula);
            return ResponseEntity.ok(empleado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/crear")
    @PreAuthorize("hasAuthority('GERENTE')")
    public ResponseEntity<Empleado> createEmpleado(@Valid @RequestBody Empleado empleado) {
        Empleado nuevoEmpleado = empleadoService.crearEmpleado(empleado);
        return ResponseEntity.ok(nuevoEmpleado);
    }

    // ================== RELACIÓN EMPLEADO - CARGO ==================

    @PostMapping("/{cedula}/cargos/{cargoId}")
    public ResponseEntity<Empleado> addCargoToEmpleado(@PathVariable String cedula, @PathVariable int cargoId) {
        try {
            Empleado updated = empleadoService.agregarCargoAEmpleado(cedula, cargoId);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{cedula}/cargos/{cargoId}")
    public ResponseEntity<Empleado> removeCargoFromEmpleado(@PathVariable String cedula, @PathVariable int cargoId) {
        try {
            Empleado updated = empleadoService.removerCargoDeEmpleado(cedula, cargoId);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/cargo/{cargoId}")
    public ResponseEntity<List<Empleado>> getEmpleadosByCargo(@PathVariable int cargoId) {
        List<Empleado> empleados = empleadoService.obtenerEmpleadosPorCargo(cargoId);
        return ResponseEntity.ok(empleados);
    }

    // ================== CRUD DE CARGOS ==================

    @GetMapping("/cargos")
    public ResponseEntity<List<Cargo>> getAllCargos() {
        return ResponseEntity.ok(empleadoService.obtenerTodosCargos());
    }

    @GetMapping("/cargos/{id}")
    public ResponseEntity<Cargo> getCargoById(@PathVariable int id) {
        try {
            return ResponseEntity.ok(empleadoService.obtenerCargoPorId(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/cargos")
    public ResponseEntity<Cargo> createCargo(@RequestBody Cargo cargo) {
        try {
            return ResponseEntity.ok(empleadoService.crearCargo(cargo));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/cargos/{id}")
    public ResponseEntity<Void> deleteCargo(@PathVariable int id) {
        try {
            empleadoService.eliminarCargo(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
