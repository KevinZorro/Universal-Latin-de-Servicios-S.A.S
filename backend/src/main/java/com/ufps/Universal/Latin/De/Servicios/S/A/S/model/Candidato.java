package com.ufps.Universal.Latin.De.Servicios.S.A.S.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class Candidato extends Usuario {

    // @Id
    // @GeneratedValue(strategy = GenerationType.IDENTITY)
    // private int id;

    private String hojaDeVidaURL;

    private boolean estadoProceso;
}
