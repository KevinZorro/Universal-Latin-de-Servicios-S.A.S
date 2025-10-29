package com.ufps.Universal.Latin.De.Servicios.S.A.S.repository;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.OrdenServicio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrdenServicioRepository extends JpaRepository<OrdenServicio, Integer> {
    List<OrdenServicio> findByIdOrden(Integer idOrden);

    List<OrdenServicio> findByServicio_IdServicio(Integer idServicio);

    List<OrdenServicio> findByIdEmpleadoAsignado(Integer idEmpleadoAsignado);

    List<OrdenServicio> findByEstado(String estado);
}