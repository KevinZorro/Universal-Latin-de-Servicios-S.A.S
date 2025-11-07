package com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO;

import lombok.Data;
import java.util.Date;

@Data
public class AsignacionDto {
    private int id;
    private int ordenServicioId;
    private String empleadoId;
    private Date fechaAsignacion;
}
