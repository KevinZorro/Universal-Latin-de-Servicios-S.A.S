package com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO;

import lombok.Data;

@Data
public class OrdenServicioDto {
    private int id;
    private int servicioId;
    private int ordenId;
    private String estado;
}
