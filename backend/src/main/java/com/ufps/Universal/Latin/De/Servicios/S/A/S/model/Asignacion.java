package com.ufps.Universal.Latin.De.Servicios.S.A.S.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Entity
@Data
public class Asignacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "orden_servicio_id")
    private Orden_Servicio orden;

    @Temporal(TemporalType.TIMESTAMP)
    private Date fechaAsignacion;

    @ManyToOne
    @JoinColumn(name = "empleado_id")
    private Empleado empleado;
}
