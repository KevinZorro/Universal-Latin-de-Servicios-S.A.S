package com.ufps.Universal.Latin.De.Servicios.S.A.S.service;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Orden;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.repository.OrdenRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrdenService {

    private final OrdenRepository ordenRepository;

    public OrdenService(OrdenRepository ordenRepository) {
        this.ordenRepository = ordenRepository;
    }

    public List<Orden> findAll() { return ordenRepository.findAll(); }

    public Optional<Orden> findById(int idOrden) { return ordenRepository.findById(idOrden); }

    public Orden save(Orden orden) { return ordenRepository.save(orden); }

    public void deleteById(int idOrden) { ordenRepository.deleteById(idOrden); }
}
