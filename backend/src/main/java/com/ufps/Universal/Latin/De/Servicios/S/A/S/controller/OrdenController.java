package com.ufps.Universal.Latin.De.Servicios.S.A.S.controller;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO.OrdenDto;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Orden;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Cliente;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.service.OrdenService;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.service.ClienteService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ordenes")
@CrossOrigin(origins = "http://localhost:3000")
public class OrdenController {

    private final OrdenService ordenService;
    private final ClienteService clienteService;

    public OrdenController(OrdenService ordenService, ClienteService clienteService) {
        this.ordenService = ordenService;
        this.clienteService = clienteService;
    }

    @GetMapping
    public List<OrdenDto> getAllOrdenes() {
        return ordenService.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{idOrden}")
    public OrdenDto getOrdenById(@PathVariable int idOrden) {
        Optional<Orden> orden = ordenService.findById(idOrden);
        return orden.map(this::toDto).orElse(null);
    }

    @PostMapping
    public OrdenDto createOrden(@RequestBody OrdenDto ordenDto) {
        Orden orden = toEntity(ordenDto);
        Orden savedOrden = ordenService.save(orden);
        return toDto(savedOrden);
    }

    @DeleteMapping("/{idOrden}")
    public void deleteOrden(@PathVariable int idOrden) {
        ordenService.deleteById(idOrden);
    }

    // Conversión entre Entity y DTO
    private OrdenDto toDto(Orden orden) {
        OrdenDto dto = new OrdenDto();
        dto.setIdOrden(orden.getIdOrden());
        dto.setClienteId(orden.getCliente() != null ? orden.getCliente().getId() : null); // Cliente ID solo
        dto.setFechaCreacion(orden.getFechaCreacion());
        dto.setFechaFin(orden.getFechaFin());
        dto.setEstadoOrden(orden.isEstadoOrden());
        return dto;
    }

    private Orden toEntity(OrdenDto dto) {
        Orden orden = new Orden();
        orden.setIdOrden(dto.getIdOrden());
        if(dto.getClienteId() != 0){
            Optional<Cliente> clienteOpt = clienteService.findById(dto.getClienteId());
            clienteOpt.ifPresent(orden::setCliente);
        }
        orden.setFechaCreacion(dto.getFechaCreacion());
        orden.setFechaFin(dto.getFechaFin());
        orden.setEstadoOrden(dto.isEstadoOrden());
        return orden;
    }
}
