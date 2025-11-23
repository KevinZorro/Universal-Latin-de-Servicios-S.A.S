package com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO;


import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AgendaResponseDto {
    private Integer id;
    private Integer ordenId;
    private String empleadoCedula;
    private String empleadoNombre; // opcional para UI
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime fechaInicio;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime fechaFin;
    private boolean activa;
}
