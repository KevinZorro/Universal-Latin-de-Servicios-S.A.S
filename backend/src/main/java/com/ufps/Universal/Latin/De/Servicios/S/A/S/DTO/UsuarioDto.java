package com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class UsuarioDto {

    private String cedula;

    @NotBlank(message = "El nombre no debe estar vacío")
    private String nombre;

    @NotBlank(message = "El apellido no debe estar vacío")
    private String apellido;

    @Email(message = "Email inválido")
    @NotBlank(message = "El email no debe estar vacío")
    private String email;

    @NotBlank(message = "La contraseña no debe estar vacía")
    private String password;

    @NotBlank(message = "El teléfono no debe estar vacío")
    private String telefono;

    @NotBlank(message = "El rol no debe estar vacío")
    private String rol;

    private Integer idrol;
}