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
public class Usuario {

    @Id
    @Column(name = "cedula")
    private String cedula;

    @NotBlank
    private String telefono;

    @NotBlank
    private String passwordHash;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String apellido;

    @NotBlank
    private String nombre;

    @NotNull
    @Enumerated(EnumType.STRING)
    private Rol rol;
}
