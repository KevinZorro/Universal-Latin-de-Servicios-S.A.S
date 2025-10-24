package com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class UsuarioDto {

    private String cedula;

    @NotBlank
    private String telefono;

    @NotBlank
    private String password;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String apellido;

    @NotBlank
    private String nombre;

    @NotNull
    private String rol;    
}
