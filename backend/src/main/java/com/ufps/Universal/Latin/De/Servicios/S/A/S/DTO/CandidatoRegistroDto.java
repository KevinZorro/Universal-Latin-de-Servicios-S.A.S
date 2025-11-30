package com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CandidatoRegistroDto {
    private String cedula; 
    private String nombre;
    private String apellido;
    private String email;
    private String telefono;
    private String posicion;
    private String experiencia;
    private String mensaje;
}