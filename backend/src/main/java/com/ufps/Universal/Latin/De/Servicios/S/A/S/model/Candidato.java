package com.ufps.Universal.Latin.De.Servicios.S.A.S.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "candidatos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
public class Candidato extends Usuario {

    private String hojaDeVidaURL;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoProceso estadoProceso;

    private String posicion;

    private String experiencia;

    @Column(columnDefinition = "TEXT")
    private String mensaje;
}
