package com.ufps.Universal.Latin.De.Servicios.S.A.S.model;

import lombok.*;
import lombok.experimental.SuperBuilder;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "usuarios")
@Inheritance(strategy = InheritanceType.JOINED)
@Data
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
@AllArgsConstructor
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
