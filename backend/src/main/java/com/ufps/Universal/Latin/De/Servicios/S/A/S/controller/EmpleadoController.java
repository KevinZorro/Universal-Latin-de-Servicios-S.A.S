package com.ufps.Universal.Latin.De.Servicios.S.A.S.controller;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO.EmpleadoDto;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Empleado;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.service.EmpleadoService;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/empleados")
public class EmpleadoController {

    private final EmpleadoService empleadoService;

    public EmpleadoController(EmpleadoService empleadoService) {
        this.empleadoService = empleadoService;
    }

    @GetMapping
    public List<EmpleadoDto> getAllEmpleados() {
        return empleadoService.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public EmpleadoDto getEmpleadoById(@PathVariable Integer id) {
        Optional<Empleado> empleado = empleadoService.findById(id);
        return empleado.map(this::toDto).orElse(null);
    }

    @PostMapping
    public EmpleadoDto createEmpleado(@Valid @RequestBody EmpleadoDto empleadoDto) {
        Empleado empleado = toEntity(empleadoDto);
        Empleado saved = empleadoService.save(empleado);
        return toDto(saved);
    }

    @PutMapping("/{id}")
    public EmpleadoDto updateEmpleado(@PathVariable Integer id, @Valid @RequestBody EmpleadoDto empleadoDto) {
        Empleado empleado = toEntity(empleadoDto);
        empleado.setCedula(id);
        Empleado updated = empleadoService.save(empleado);
        return toDto(updated);
    }

    @DeleteMapping("/{id}")
    public void deleteEmpleado(@PathVariable Integer id) {
        empleadoService.deleteById(id);
    }

    // Métodos de conversión entre Entity y DTO
    private EmpleadoDto toDto(Empleado empleado) {
        EmpleadoDto dto = new EmpleadoDto();
        dto.setCargo(empleado.getCargo());
        dto.setFechaIngreso(empleado.getFechaIngreso());
        dto.setActivo(empleado.getActivo());
        dto.setDesprendiblePagoURL(empleado.getDesprendiblePagoURL());
        dto.setHojaDeVidaURL(empleado.getHojaDeVidaURL());
        return dto;
    }

    private Empleado toEntity(EmpleadoDto dto) {
        return Empleado.builder()
                .cargo(dto.getCargo())
                .fechaIngreso(dto.getFechaIngreso())
                .activo(dto.getActivo())
                .desprendiblePagoURL(dto.getDesprendiblePagoURL())
                .hojaDeVidaURL(dto.getHojaDeVidaURL())
                .build();
    }
}