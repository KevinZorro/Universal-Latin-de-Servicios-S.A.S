package com.ufps.Universal.Latin.De.Servicios.S.A.S.service;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Cliente;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.repository.ClienteRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    public List<Cliente> findAll() { return clienteRepository.findAll(); }

    public Optional<Cliente> findById(int id) { return clienteRepository.findById(id); }

    public Cliente save(Cliente cliente) { return clienteRepository.save(cliente); }

    public void deleteById(int id) { clienteRepository.deleteById(id); }
}
