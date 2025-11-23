package com.ufps.Universal.Latin.De.Servicios.S.A.S.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;


@Entity
@Data
public class Servicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String nombreServicio;

    private String descripcion;

    private boolean estado;

    private String tipoHorario;

    @ManyToOne
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;

}