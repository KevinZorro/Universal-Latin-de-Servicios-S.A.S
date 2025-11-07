package com.ufps.Universal.Latin.De.Servicios.S.A.S.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Entity
@Data
public class Observacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idObservacion;

    @ManyToOne
    @JoinColumn(name = "orden_servicio_id")
    private Orden_Servicio orden;

    @Temporal(TemporalType.TIMESTAMP)
    private Date fechaObservacion;

    @ManyToOne
    @JoinColumn(name = "empleado_id")
    private Empleado empleado;

    private String descripcion;
}
