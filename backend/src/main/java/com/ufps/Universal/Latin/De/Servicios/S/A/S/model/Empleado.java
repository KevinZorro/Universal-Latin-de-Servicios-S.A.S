package com.ufps.Universal.Latin.De.Servicios.S.A.S.model;

import lombok.*;
import lombok.experimental.SuperBuilder;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.hibernate.validator.constraints.URL;
import java.time.LocalDate;

@Entity
@Table(name = "empleados")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@PrimaryKeyJoinColumn(name = "cedula")
public class Empleado extends Usuario {
    @NotBlank
    private String cargo;

    @NotNull
    @Column(name = "fecha_ingreso")
    private LocalDate fechaIngreso;

    @NotNull
    private Boolean activo;

    @URL
    @Column(name = "desprendible_pago_url")
    private String desprendiblePagoURL;

    @URL
    @Column(name = "hoja_de_vida_url")
    private String hojaDeVidaURL;
}
