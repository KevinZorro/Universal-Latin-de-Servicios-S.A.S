package com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor


public class RegistroDto {
    public String cedula;
    public String nombre;
    public String apellido;
    public String telefono;
    public String email;
    public String password;
    public String rol; // "EMPLEADO"/"GERENTE"
    // otros campos específicos según el tipo
}