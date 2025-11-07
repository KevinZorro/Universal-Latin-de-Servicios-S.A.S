package com.ufps.Universal.Latin.De.Servicios.S.A.S.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class PQRs {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String tipo;

    private String descripcion;

    private LocalDateTime fechaCreacion;

    private String estado;

    private String respuesta;

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;
}
