package com.ufps.Universal.Latin.De.Servicios.S.A.S.service;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Candidato;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.repository.CandidatoRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CandidatoService {

    private final CandidatoRepository candidatoRepository;

    public CandidatoService(CandidatoRepository candidatoRepository) {
        this.candidatoRepository = candidatoRepository;
    }

    public List<Candidato> findAll() { return candidatoRepository.findAll(); }

    public Optional<Candidato> findById(int id) { return candidatoRepository.findById(id); }

    public Candidato save(Candidato candidato) { return candidatoRepository.save(candidato); }

    public void deleteById(int id) { candidatoRepository.deleteById(id); }

    public void registrarCandidato(Candidato candidato) {
        // Aquí podrías incluir lógica adicional de registro
        candidatoRepository.save(candidato);
    }
}
