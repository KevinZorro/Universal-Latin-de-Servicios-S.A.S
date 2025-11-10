package com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class PQRsDto {
    private int id;
    private String tipo;
    private String descripcion;
    private LocalDateTime fechaCreacion;
    private String estado;
    private String respuesta;
    private int clienteId;
    private String nombreCompleto;
    private String email;
    private String telefono;
}
