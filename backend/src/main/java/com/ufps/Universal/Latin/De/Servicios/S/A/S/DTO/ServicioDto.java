package com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO;

import lombok.Data;


@Data
public class ServicioDto {
    private String nombreServicio;
    private String descripcion;
    private boolean estado;
    private String tipoHorario;
}
