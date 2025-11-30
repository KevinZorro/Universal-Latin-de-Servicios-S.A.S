package com.ufps.Universal.Latin.De.Servicios.S.A.S.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "usuarios")
@Inheritance(strategy = InheritanceType.JOINED)
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
@SuperBuilder
public abstract class Usuario {

    @Id
    @Column(name = "cedula")
    private String cedula;

    private String telefono;

    private String passwordHash;

    @Email
    private String email;

    private String apellido;

    private String nombre;

    @Enumerated(EnumType.STRING)
    private Rol rol;
}
