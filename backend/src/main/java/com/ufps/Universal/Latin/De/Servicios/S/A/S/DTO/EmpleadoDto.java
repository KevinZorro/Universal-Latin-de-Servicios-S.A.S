package com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO;

import org.hibernate.validator.constraints.URL;
import lombok.Data;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Data
public class EmpleadoDto {

    private String cedula;

    private String nombre;

    private String email;

    private Set<CargoDto> cargos = new HashSet<>();

    @NotNull
    private LocalDate fechaIngreso;

    @NotNull
    private Boolean activo;

    @URL
    private String desprendiblePagoURL;

    @URL
    private String hojaDeVidaURL;
}
