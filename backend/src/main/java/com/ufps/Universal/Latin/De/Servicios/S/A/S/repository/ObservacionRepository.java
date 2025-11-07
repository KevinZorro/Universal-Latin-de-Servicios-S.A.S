package com.ufps.Universal.Latin.De.Servicios.S.A.S.repository;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Observacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ObservacionRepository extends JpaRepository<Observacion, Integer> {
    // Métodos personalizados si los necesitas
}
