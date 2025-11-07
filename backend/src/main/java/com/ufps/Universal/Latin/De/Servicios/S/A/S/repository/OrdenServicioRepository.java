package com.ufps.Universal.Latin.De.Servicios.S.A.S.repository;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Orden_Servicio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrdenServicioRepository extends JpaRepository<Orden_Servicio, Integer> {
    // Métodos personalizados si los necesitas
}
