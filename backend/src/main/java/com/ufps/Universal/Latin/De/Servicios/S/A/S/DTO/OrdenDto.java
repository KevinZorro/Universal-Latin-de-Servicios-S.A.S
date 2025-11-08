package com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO;

import lombok.Data;
import java.util.Date;

@Data
public class OrdenDto {
    private int idOrden;
    private int clienteId; // Relaciona solo el ID del cliente para mantener el DTO simple
    private Date fechaCreacion;
    private Date fechaFin;
    private boolean estadoOrden;
}
