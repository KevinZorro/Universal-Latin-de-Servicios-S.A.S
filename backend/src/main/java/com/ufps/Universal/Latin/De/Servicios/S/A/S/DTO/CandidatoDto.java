package com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO;

import lombok.Data;

@Data
public class CandidatoDto extends UsuarioDto {
    private String hojaDeVidaURL;
    private boolean estadoProceso;
}
