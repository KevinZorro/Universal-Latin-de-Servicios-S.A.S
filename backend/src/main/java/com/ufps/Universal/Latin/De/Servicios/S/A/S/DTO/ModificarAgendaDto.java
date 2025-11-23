package com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO;


import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ModificarAgendaDto {
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime nuevoInicio;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime nuevoFin;

    // opcional: permitir reasignar empleado
    private String nuevoEmpleadoCedula;
}