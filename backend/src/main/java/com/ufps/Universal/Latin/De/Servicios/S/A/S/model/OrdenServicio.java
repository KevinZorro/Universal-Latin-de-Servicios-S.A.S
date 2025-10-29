package com.ufps.Universal.Latin.De.Servicios.S.A.S.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ordenservicio")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrdenServicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idordenservicio")
    private Integer idOrdenServicio;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idservicio", nullable = false)
    private Servicio servicio;

    @Column(name = "idorden", nullable = false)
    private Integer idOrden;

    @Column(name = "idempleadoasignado")
    private Integer idEmpleadoAsignado;

    @Column(name = "estado", length = 50)
    private String estado;
}