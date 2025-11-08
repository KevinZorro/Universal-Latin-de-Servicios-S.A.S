package com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO;

import lombok.Data;

@Data
public class ClienteDto {
    private int id;
    private String nombre;
    private int telefono;
    private String direccion;
    private int nit;
    private String email;
    private String ciudad;
}
