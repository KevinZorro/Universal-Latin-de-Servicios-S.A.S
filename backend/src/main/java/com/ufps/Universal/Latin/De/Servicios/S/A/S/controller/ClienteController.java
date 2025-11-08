package com.ufps.Universal.Latin.De.Servicios.S.A.S.controller;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO.ClienteDto;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Cliente;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.service.ClienteService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @GetMapping
    public List<ClienteDto> getAllClientes() {
        return clienteService.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ClienteDto getClienteById(@PathVariable int id) {
        Optional<Cliente> cliente = clienteService.findById(id);
        return cliente.map(this::toDto).orElse(null);
    }

    @PostMapping
    public ClienteDto createCliente(@RequestBody ClienteDto clienteDto) {
        Cliente cliente = toEntity(clienteDto);
        Cliente savedCliente = clienteService.save(cliente);
        return toDto(savedCliente);
    }

    @DeleteMapping("/{id}")
    public void deleteCliente(@PathVariable int id) {
        clienteService.deleteById(id);
    }

    // Conversión entre Entity y DTO
    private ClienteDto toDto(Cliente cliente) {
        ClienteDto dto = new ClienteDto();
        dto.setId(cliente.getId());
        dto.setNombre(cliente.getNombre());
        dto.setTelefono(cliente.getTelefono());
        dto.setDireccion(cliente.getDireccion());
        dto.setNit(cliente.getNit());
        dto.setEmail(cliente.getEmail());
        dto.setCiudad(cliente.getCiudad());
        return dto;
    }

    private Cliente toEntity(ClienteDto dto) {
        Cliente cliente = new Cliente();
        cliente.setId(dto.getId());
        cliente.setNombre(dto.getNombre());
        cliente.setTelefono(dto.getTelefono());
        cliente.setDireccion(dto.getDireccion());
        cliente.setNit(dto.getNit());
        cliente.setEmail(dto.getEmail());
        cliente.setCiudad(dto.getCiudad());
        return cliente;
    }
}
