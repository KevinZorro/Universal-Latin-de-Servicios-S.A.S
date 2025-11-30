package com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Rol;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

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
    private Rol rol;

}
