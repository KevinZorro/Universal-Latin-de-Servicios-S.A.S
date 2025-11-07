package com.ufps.Universal.Latin.De.Servicios.S.A.S.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Entity
@Data
public class Evidencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idEvidencia;

    @ManyToOne
    @JoinColumn(name = "orden_servicio_id")
    private Orden_Servicio ordenServicio;

    private String descripcion;

    private String tipoArchivo;

    private String rutaArchivo;

    @Temporal(TemporalType.TIMESTAMP)
    private Date fechaRegistro;

    private String registradaPor;
}
