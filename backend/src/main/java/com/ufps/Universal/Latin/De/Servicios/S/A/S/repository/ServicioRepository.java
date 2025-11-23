package com.ufps.Universal.Latin.De.Servicios.S.A.S.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Servicio;

public interface ServicioRepository extends JpaRepository<Servicio, Integer> {

    List<Servicio> findByCategoriaId(Long categoriaId);
}
