package com.ufps.Universal.Latin.De.Servicios.S.A.S.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Agenda;

public interface AgendaRepository extends JpaRepository<Agenda, Integer> {

    // Buscar solapamientos con otras órdenes del empleado
    @Query("""
        SELECT a FROM Agenda a
        WHERE a.empleado.cedula = :cedula
        AND a.activa = true
        AND (
            (a.fechaInicio <= :fin AND a.fechaFin >= :inicio)
        )
    """)
    List<Agenda> verificarDisponibilidad(String cedula, LocalDateTime inicio, LocalDateTime fin);

}