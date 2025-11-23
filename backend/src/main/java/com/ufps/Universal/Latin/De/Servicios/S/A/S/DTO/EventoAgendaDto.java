package com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO;
import lombok.Data;


@Data
public class EventoAgendaDto {
    private String fechaInicio;   // "2025-11-20T08:00:00"
    private String fechaFin;      // "2025-12-20T20:00:00"
    private String cliente;
    private String ubicacion;
    private String estado;
}

