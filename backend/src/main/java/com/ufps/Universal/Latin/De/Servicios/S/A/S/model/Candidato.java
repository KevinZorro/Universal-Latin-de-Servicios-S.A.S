package com.ufps.Universal.Latin.De.Servicios.S.A.S.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class Candidato extends Usuario {

    private String hojaDeVidaURL;

    private boolean estadoProceso;
}
