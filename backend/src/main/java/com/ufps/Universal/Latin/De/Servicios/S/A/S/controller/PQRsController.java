package com.ufps.Universal.Latin.De.Servicios.S.A.S.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO.PQRsDto;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Cliente;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.PQRs;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.service.ClienteService;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.service.EmpleadoService;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.service.PQRsService;

@RestController
@RequestMapping("/api/pqrs")
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
        // 1. Lógica para manejar el Cliente
        Cliente cliente = null;
        if (dto.getEmail() != null && !dto.getEmail().isEmpty()) {
            // Buscamos si el cliente ya existe por su email
            Optional<Cliente> clienteExistente = clienteService.buscarPorEmail(dto.getEmail());
            
            if (clienteExistente.isPresent()) {
                cliente = clienteExistente.get();
            } else {
                // Si no existe, creamos uno nuevo
                Cliente nuevoCliente = new Cliente();
                nuevoCliente.setNombre(dto.getNombreCompleto());
                nuevoCliente.setEmail(dto.getEmail());
                nuevoCliente.setTelefono(dto.getTelefono());
                cliente = clienteService.save(nuevoCliente); // Guardamos el nuevo cliente
            }
        }

        // 2. Crear la PQRS y asignarle el cliente
        PQRs entity = new PQRs();
        entity.setTipo(dto.getTipo());
        entity.setDescripcion(dto.getDescripcion());
        entity.setFechaCreacion(LocalDateTime.now());
        entity.setEstado("Pendiente"); // Estado inicial por defecto
        entity.setCliente(cliente); // Asignamos el cliente encontrado o creado

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
        if (pqrs.getCliente() != null) {
            dto.setClienteId(pqrs.getCliente().getId());
            // Llenamos los nuevos campos con la info del cliente
            dto.setNombreCompleto(pqrs.getCliente().getNombre());
            dto.setEmail(pqrs.getCliente().getEmail());
            dto.setTelefono(pqrs.getCliente().getTelefono());
        } else {
            dto.setClienteId(0); 
        }
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
