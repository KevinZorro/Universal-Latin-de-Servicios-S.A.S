package com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO;

import org.hibernate.validator.constraints.URL;
import lombok.Data;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

@Data
public class EmpleadoDto {

    @NotBlank
    private String cargo;

    @NotNull
    private LocalDate fechaIngreso;

    @NotNull
    private Boolean activo;

    @URL
    private String desprendiblePagoURL;

    @URL
    private String hojaDeVidaURL;
}
