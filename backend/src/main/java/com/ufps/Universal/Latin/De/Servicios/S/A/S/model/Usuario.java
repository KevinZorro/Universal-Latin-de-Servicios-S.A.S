package com.ufps.Universal.Latin.De.Servicios.S.A.S.model;

import lombok.*;
import lombok.experimental.SuperBuilder;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "usuario")
@Inheritance(strategy = InheritanceType.JOINED)
@Data
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public abstract class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idusuario")
    private Integer idusuario;

    @NotBlank(message = "La cédula no debe estar vacía")
    @Column(name = "cedula", unique = true, nullable = false)
    private String cedula;

    @NotBlank(message = "El nombre no debe estar vacío")
    @Column(nullable = false)
    private String nombre;

    @NotBlank(message = "El apellido no debe estar vacío")
    @Column(nullable = false)
    private String apellido;

    @Email(message = "Email inválido")
    @NotBlank(message = "El email no debe estar vacío")
    @Column(unique = true, nullable = false)
    private String email;

    @NotBlank(message = "El teléfono no debe estar vacío")
    @Column(nullable = false)
    private String telefono;

    @NotBlank(message = "La contraseña hash no debe estar vacía")
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "rol", nullable = false)
    private Rol rol;

    @Column(name = "idrol")
    private Integer idrol;

    @NotBlank(message = "La contraseña no debe estar vacía")
    @Column(name = "password")
    private String password;
}