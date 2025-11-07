package com.ufps.Universal.Latin.De.Servicios.S.A.S.service;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Orden_Servicio;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.repository.OrdenServicioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrdenServicioService {

    private final OrdenServicioRepository ordenServicioRepository;

    public OrdenServicioService(OrdenServicioRepository ordenServicioRepository) {
        this.ordenServicioRepository = ordenServicioRepository;
    }

    public List<Orden_Servicio> findAll() { return ordenServicioRepository.findAll(); }

    public Optional<Orden_Servicio> findById(int id) { return ordenServicioRepository.findById(id); }

    public Orden_Servicio save(Orden_Servicio ordenServicio) { return ordenServicioRepository.save(ordenServicio); }

    public void deleteById(int id) { ordenServicioRepository.deleteById(id); }
}
