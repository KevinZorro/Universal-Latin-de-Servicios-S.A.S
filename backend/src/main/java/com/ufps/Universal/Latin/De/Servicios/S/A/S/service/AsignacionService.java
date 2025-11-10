package com.ufps.Universal.Latin.De.Servicios.S.A.S.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Asignacion;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.repository.AsignacionRepository;

@Service
public class AsignacionService {

    private final AsignacionRepository asignacionRepository;

    public AsignacionService(AsignacionRepository asignacionRepository) {
        this.asignacionRepository = asignacionRepository;
    }

    public List<Asignacion> findAll() {
        return asignacionRepository.findAll();
    }

    public Optional<Asignacion> findById(int id) {
        return asignacionRepository.findById(id);
    }

    public Asignacion save(Asignacion asignacion) {
        return asignacionRepository.save(asignacion);
    }

    public void deleteById(int id) {
        asignacionRepository.deleteById(id);
    }
}
