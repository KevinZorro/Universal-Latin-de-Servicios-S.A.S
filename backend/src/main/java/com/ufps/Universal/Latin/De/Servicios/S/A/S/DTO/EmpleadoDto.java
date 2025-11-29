package com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import org.hibernate.validator.constraints.URL;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.TipoContrato;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

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

    private TipoContrato tipoContrato;
    private LocalDate fechaRetiro;

}
