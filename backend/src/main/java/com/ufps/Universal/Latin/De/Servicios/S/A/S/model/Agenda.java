package com.ufps.Universal.Latin.De.Servicios.S.A.S.model;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Agenda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "empleado_id")
    private Empleado empleado;

    @ManyToOne
    @JoinColumn(name = "orden_id")
    private Orden orden;

    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;

    private boolean activa = true;
}