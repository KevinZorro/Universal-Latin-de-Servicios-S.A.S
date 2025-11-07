package com.ufps.Universal.Latin.De.Servicios.S.A.S.service;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.PQRs;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Empleado;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.repository.PQRsRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PQRsService {

    private final PQRsRepository pqrsRepository;

    public PQRsService(PQRsRepository pqrsRepository) {
        this.pqrsRepository = pqrsRepository;
    }

    public List<PQRs> findAll() { return pqrsRepository.findAll(); }

    public Optional<PQRs> findById(int id) { return pqrsRepository.findById(id); }

    public PQRs save(PQRs pqrs) { return pqrsRepository.save(pqrs); }

    public void deleteById(int id) { pqrsRepository.deleteById(id); }

    public void responderPqr(int id, String respuesta, Empleado empleado) {
        Optional<PQRs> pqrsOpt = pqrsRepository.findById(id);
        pqrsOpt.ifPresent(pqrs -> {
            pqrs.setRespuesta(respuesta + " (respondido por: " + empleado.getNombre() + ")");
            pqrsRepository.save(pqrs);
        });
    }

    public void actualizarEstado(int id, String estado) {
        Optional<PQRs> pqrsOpt = pqrsRepository.findById(id);
        pqrsOpt.ifPresent(pqrs -> {
            pqrs.setEstado(estado);
            pqrsRepository.save(pqrs);
        });
    }
}
