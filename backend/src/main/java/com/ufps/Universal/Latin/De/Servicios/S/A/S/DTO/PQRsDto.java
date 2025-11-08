package com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PQRsDto {
    private int id;
    private String tipo;
    private String descripcion;
    private LocalDateTime fechaCreacion;
    private String estado;
    private String respuesta;
    private int clienteId;
}
