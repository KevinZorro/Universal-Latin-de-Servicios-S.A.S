package com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrdenServicioDto {

    @NotNull(message = "El ID del servicio es obligatorio")
    private Integer idServicio;

    @NotNull(message = "El ID de la orden es obligatorio")
    private Integer idOrden;

    private Integer idEmpleadoAsignado;

    @Size(max = 50, message = "El estado no puede exceder 50 caracteres")
    private String estado;
}