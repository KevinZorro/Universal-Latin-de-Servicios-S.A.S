package com.ufps.Universal.Latin.De.Servicios.S.A.S.repository;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Cargo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CargoRepository extends JpaRepository<Cargo, Integer> {
    
    // Método personalizado para buscar por nombre
    Optional<Cargo> findByNombre(String nombre);
    
    // Verificar si existe un tipo de empleado con ese nombre
    boolean existsByNombre(String nombre);
}
