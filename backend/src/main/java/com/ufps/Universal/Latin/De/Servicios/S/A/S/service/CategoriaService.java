package com.ufps.Universal.Latin.De.Servicios.S.A.S.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Categoria;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.repository.CategoriaRepository;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    public List<Categoria> obtenerTodas() {
        return categoriaRepository.findAll();
    }
}