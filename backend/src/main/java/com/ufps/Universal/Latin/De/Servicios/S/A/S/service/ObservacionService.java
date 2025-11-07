package com.ufps.Universal.Latin.De.Servicios.S.A.S.service;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Observacion;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.repository.ObservacionRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ObservacionService {

    private final ObservacionRepository observacionRepository;

    public ObservacionService(ObservacionRepository observacionRepository) {
        this.observacionRepository = observacionRepository;
    }

    public List<Observacion> findAll() { return observacionRepository.findAll(); }

    public Optional<Observacion> findById(int idObservacion) { return observacionRepository.findById(idObservacion); }

    public Observacion save(Observacion observacion) { return observacionRepository.save(observacion); }

    public void deleteById(int idObservacion) { observacionRepository.deleteById(idObservacion); }
}
