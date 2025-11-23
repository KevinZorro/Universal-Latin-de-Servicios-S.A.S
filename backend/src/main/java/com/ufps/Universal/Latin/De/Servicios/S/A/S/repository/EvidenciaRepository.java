package com.ufps.Universal.Latin.De.Servicios.S.A.S.repository;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Estado;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Evidencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.time.LocalDateTime;
import org.springframework.data.jpa.repository.Query;

@Repository
public interface EvidenciaRepository extends JpaRepository<Evidencia, Integer> {
    List<Evidencia> findByOrdenServicioId(int ordenId);

@Query("""
    SELECT e FROM Evidencia e
    WHERE (COALESCE(:fechaInicio, e.horaInicio) <= e.horaInicio)
    AND (COALESCE(:fechaFin, e.horaFin) >= e.horaFin)
    AND (COALESCE(:clienteId, e.ordenServicio.orden.cliente.id) = e.ordenServicio.orden.cliente.id)
    AND (COALESCE(:servicioId, e.ordenServicio.servicio.id) = e.ordenServicio.servicio.id)
    AND (COALESCE(:estado, e.ordenServicio.estado) = e.ordenServicio.estado)
    AND (COALESCE(:empleadoId, e.registradaPor.cedula) = e.registradaPor.cedula)
""")
List<Evidencia> filtrarDashboard(
    LocalDateTime fechaInicio,
    LocalDateTime fechaFin,
    Integer clienteId,
    Integer servicioId,
    Estado estado,
    String empleadoId
);




}
