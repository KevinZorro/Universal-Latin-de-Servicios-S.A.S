package com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO;

import lombok.Data;

@Data
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