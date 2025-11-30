package com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.EstadoProceso;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CandidatoDto extends UsuarioDto {
    private String hojaDeVidaURL;
    private EstadoProceso estadoProceso;
    private String posicion;
    private String experiencia;
    private String mensaje;
}
