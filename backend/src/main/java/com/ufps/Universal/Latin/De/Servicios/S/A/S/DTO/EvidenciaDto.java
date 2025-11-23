package com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Data
public class EvidenciaDto {
    private int idEvidencia;
    private int ordenServicioId;
    private String descripcion;
    private String tipoArchivo;
    private String rutaArchivo;
    private Date fechaRegistro;
    private String empleadoId;
    private LocalDateTime horaInicio;
    private LocalDateTime horaFin;
}
