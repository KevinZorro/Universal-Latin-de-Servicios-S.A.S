package com.ufps.Universal.Latin.De.Servicios.S.A.S.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Entity
@Data
public class Orden {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idOrden;

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @Temporal(TemporalType.TIMESTAMP)
    private Date fechaCreacion;

    @Temporal(TemporalType.TIMESTAMP)
    private Date fechaFin;

    private boolean estadoOrden;
}
