package com.ufps.Universal.Latin.De.Servicios.S.A.S.controller;

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
import org.springframework.web.bind.annotation.RestController;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO.ClienteDto;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Cliente;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.service.ClienteService;

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
        Optional<Cliente> existente= clienteService.buscarPorNit(clienteDto.getNit());
        if (existente.isPresent()) {
            return toDto(existente.get());
        }
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

    @PutMapping("/{id}")
    public ClienteDto updateCliente(@PathVariable int id, @RequestBody ClienteDto clienteDto) {
        Optional<Cliente> clienteExistente = clienteService.findById(id);

        if (!clienteExistente.isPresent()) {
            return null; // O lanza una excepción personalizada
        }

        Cliente cliente = clienteExistente.get();

        // Actualizar valores
        cliente.setNombre(clienteDto.getNombre());
        cliente.setTelefono(clienteDto.getTelefono());
        cliente.setDireccion(clienteDto.getDireccion());
        cliente.setNit(clienteDto.getNit());
        cliente.setEmail(clienteDto.getEmail());
        cliente.setCiudad(clienteDto.getCiudad());

        Cliente actualizado = clienteService.save(cliente);

        return toDto(actualizado);
    }

}
