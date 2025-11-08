package com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO;

import lombok.Data;
import java.util.Date;

@Data
public class ObservacionDto {
    private int idObservacion;
    private int ordenServicioId;
    private String empleadoId;
    private Date fechaObservacion;
    private String descripcion;
}
