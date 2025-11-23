package com.ufps.Universal.Latin.De.Servicios.S.A.S.service;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Estado;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Evidencia;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.repository.EvidenciaRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

@Service
public class EvidenciaService {

    private final EvidenciaRepository evidenciaRepository;

    public EvidenciaService(EvidenciaRepository evidenciaRepository) {
        this.evidenciaRepository = evidenciaRepository;
    }

    public List<Evidencia> findByOrdenServicioId(int ordenId) {
        return evidenciaRepository.findByOrdenServicioId(ordenId);
    }

public List<Evidencia> filtrarDashboard(
        LocalDateTime fechaInicio,
        LocalDateTime fechaFin,
        Integer clienteId,
        Integer servicioId,
        Estado estado,
        String empleadoId
) {
    return evidenciaRepository.filtrarDashboard(
            fechaInicio, fechaFin, clienteId, servicioId, estado, empleadoId
    );
}


    

    public List<Evidencia> findAll() {
        return evidenciaRepository.findAll();
    }

    public Optional<Evidencia> findById(int idEvidencia) {
        return evidenciaRepository.findById(idEvidencia);
    }

    public Evidencia save(Evidencia evidencia) {
        return evidenciaRepository.save(evidencia);
    }

    public void deleteById(int idEvidencia) {
        evidenciaRepository.deleteById(idEvidencia);
    }

    public void cargarArchivo(Evidencia evidencia, String pathArchivo) {
        evidencia.setRutaArchivo(pathArchivo);
        evidenciaRepository.save(evidencia);
    }
}
