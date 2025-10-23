package com.ufps.Universal.Latin.De.Servicios.S.A.S.service;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Gerente;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.repository.GerenteRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GerenteService {

    private final GerenteRepository gerenteRepository;

    public GerenteService(GerenteRepository gerenteRepository) {
        this.gerenteRepository = gerenteRepository;
    }

    public List<Gerente> findAll() { return gerenteRepository.findAll(); }

    public Optional<Gerente> findById(Integer id) { return gerenteRepository.findById(id); }

    public Gerente save(Gerente gerente) { return gerenteRepository.save(gerente); }

    public void deleteById(Integer id) { gerenteRepository.deleteById(id); }
}
