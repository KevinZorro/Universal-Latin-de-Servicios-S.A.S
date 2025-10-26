package com.ufps.Universal.Latin.De.Servicios.S.A.S.repository;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Empleado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmpleadoRepository extends JpaRepository<Empleado, String> {
    
    Optional<Empleado> findByEmail(String email);
    
    // Buscar empleados que tienen un cargo específico
    @Query("SELECT e FROM Empleado e JOIN e.cargos c WHERE c.id = :cargoId")
    List<Empleado> findEmpleadosByCargoId(int cargoId);
    
    // Buscar empleados que tienen un cargo por nombre
    @Query("SELECT e FROM Empleado e JOIN e.cargos c WHERE c.nombre = :nombreCargo")
    List<Empleado> findEmpleadosByCargoNombre(String nombreCargo);
}
