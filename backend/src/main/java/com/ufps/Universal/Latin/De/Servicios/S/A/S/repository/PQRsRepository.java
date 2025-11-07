package com.ufps.Universal.Latin.De.Servicios.S.A.S.repository;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.PQRs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PQRsRepository extends JpaRepository<PQRs, Integer> {
    // Métodos personalizados si los necesitas
}
