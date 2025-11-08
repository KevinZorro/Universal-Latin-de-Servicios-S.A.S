package com.ufps.Universal.Latin.De.Servicios.S.A.S.controller;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO.PQRsDto;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.PQRs;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Cliente;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Empleado;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.service.PQRsService;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.service.ClienteService;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.service.EmpleadoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/pqrs")
@CrossOrigin(origins = "http://localhost:3000")
public class PQRsController {

    private final PQRsService pqrsService;
    private final ClienteService clienteService;
    private final EmpleadoService empleadoService;

    public PQRsController(PQRsService pqrsService, ClienteService clienteService, EmpleadoService empleadoService) {
        this.pqrsService = pqrsService;
        this.clienteService = clienteService;
        this.empleadoService = empleadoService;
    }

    @GetMapping
    public List<PQRsDto> getAllPqrs() {
        return pqrsService.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public PQRsDto getPqrsById(@PathVariable int id) {
        Optional<PQRs> pqrs = pqrsService.findById(id);
        return pqrs.map(this::toDto).orElse(null);
    }

    @PostMapping
    public PQRsDto createPqrs(@RequestBody PQRsDto dto) {
        PQRs entity = toEntity(dto);
        PQRs saved = pqrsService.save(entity);
        return toDto(saved);
    }

    @DeleteMapping("/{id}")
    public void deletePqrs(@PathVariable int id) {
        pqrsService.deleteById(id);
    }

    @PutMapping("/{id}/responder")
    public void responderPqr(@PathVariable int id, @RequestParam String respuesta, @RequestParam String empleadoId) {
        //Optional<Empleado> empleadoOpt = empleadoService.obtenerEmpleadoPorId(empleadoId);
        //empleadoOpt.ifPresent(empleado -> pqrsService.responderPqr(id, respuesta, empleado));
    }

    @PutMapping("/{id}/estado")
    public void actualizarEstado(@PathVariable int id, @RequestParam String estado) {
        pqrsService.actualizarEstado(id, estado);
    }

    // Helpers
    private PQRsDto toDto(PQRs pqrs) {
        PQRsDto dto = new PQRsDto();
        dto.setId(pqrs.getId());
        dto.setTipo(pqrs.getTipo());
        dto.setDescripcion(pqrs.getDescripcion());
        dto.setFechaCreacion(pqrs.getFechaCreacion());
        dto.setEstado(pqrs.getEstado());
        dto.setRespuesta(pqrs.getRespuesta());
        dto.setClienteId(pqrs.getCliente() != null ? pqrs.getCliente().getId() : null);
        return dto;
    }

    private PQRs toEntity(PQRsDto dto) {
        PQRs pqrs = new PQRs();
        pqrs.setId(dto.getId());
        pqrs.setTipo(dto.getTipo());
        pqrs.setDescripcion(dto.getDescripcion());
        pqrs.setFechaCreacion(dto.getFechaCreacion());
        pqrs.setEstado(dto.getEstado());
        pqrs.setRespuesta(dto.getRespuesta());
        if (dto.getClienteId() != 0) {
            Optional<Cliente> clienteOpt = clienteService.findById(dto.getClienteId());
            clienteOpt.ifPresent(pqrs::setCliente);
        }
        return pqrs;
    }
}
