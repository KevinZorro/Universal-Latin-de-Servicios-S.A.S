package com.ufps.Universal.Latin.De.Servicios.S.A.S.controller;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO.AsignacionDto;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO.EventoAgendaDto;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO.OrdenesPorEstadoDto;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Empleado;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.service.AsignacionService;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.service.EmpleadoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/asignaciones")
public class AsignacionController {

    private final AsignacionService asignacionService;
    private final EmpleadoService empleadoService;

    public AsignacionController(
            AsignacionService asignacionService,
            EmpleadoService empleadoService) {
        this.asignacionService = asignacionService;
        this.empleadoService = empleadoService;
    }

    @GetMapping
    public List<AsignacionDto> getAllAsignaciones() {
        return asignacionService.findAllDtos();
    }

    @GetMapping("/{id}")
    public AsignacionDto getAsignacionById(@PathVariable int id) {
        return asignacionService.findDtoById(id);
    }

    @PostMapping
    public AsignacionDto createAsignacion(@RequestBody AsignacionDto dto) {
        return asignacionService.saveByDto(dto);
    }

    @PutMapping("/{id}")
    public AsignacionDto updateAsignacion(@PathVariable int id, @RequestBody AsignacionDto dto) {
        dto.setId(id);
        return asignacionService.updateByDto(dto);
    }

    @DeleteMapping("/{id}")
    public void deleteAsignacion(@PathVariable int id) {
        asignacionService.deleteById(id);
    }

    @GetMapping("/empleado/{empleadoId}")
    public OrdenesPorEstadoDto obtenerTrabajosPorEmpleado(@PathVariable String empleadoId) {
        Empleado empleado = empleadoService.obtenerEmpleadoPorId(empleadoId);
        if (empleado == null) {
            throw new RuntimeException("Empleado no encontrado");
        }
        return asignacionService.obtenerOrdenesPorEmpleadoAgrupadasPorEstado(empleado);
    }

    @GetMapping("/agenda/empleado/{empleadoId}")
    public List<EventoAgendaDto> obtenerAgendaPorEmpleado(@PathVariable String empleadoId) {
        Empleado empleado = empleadoService.obtenerEmpleadoPorId(empleadoId);
        if (empleado == null)
            throw new RuntimeException("Empleado no encontrado");
        return asignacionService.obtenerEventosAgendaPorEmpleado(empleado);
    }

}
