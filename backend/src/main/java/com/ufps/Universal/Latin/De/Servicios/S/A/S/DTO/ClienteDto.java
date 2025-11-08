package com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO;

import lombok.Data;

@Data
public class ClienteDto {
    private int id;
    private String nombre;
    private String telefono;
    private String direccion;
    private int nit;
    private String email;
    private String ciudad;
}
