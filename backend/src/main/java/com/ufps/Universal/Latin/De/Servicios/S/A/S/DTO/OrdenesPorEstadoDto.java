package com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class OrdenesPorEstadoDto {
    private List<OrdenServicioDto> pendientes;
    private List<OrdenServicioDto> enProceso;
    private List<OrdenServicioDto> finalizados;
    private List<OrdenServicioDto> cancelados;
}
