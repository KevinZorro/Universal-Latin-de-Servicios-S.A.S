package com.ufps.Universal.Latin.De.Servicios.S.A.S.model;

import lombok.*;
import lombok.experimental.SuperBuilder;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.hibernate.validator.constraints.URL;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "empleado")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@PrimaryKeyJoinColumn(name = "cedula")
public class Empleado extends Usuario {

    @Column(name = "idusuario", insertable = false, updatable = false)
    private Integer idusuario;

    // Relación Many-to-Many con Cargo (lado propietario)
    @ManyToMany
    @JoinTable(name = "empleado_cargo", // Nombre de la tabla intermedia
            joinColumns = @JoinColumn(name = "cedula"), // FK de Empleado
            inverseJoinColumns = @JoinColumn(name = "cargo_id") // FK de Cargo
    )
    @Builder.Default
    @JsonIgnore
    private Set<Cargo> cargos = new HashSet<>();

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

    public void agregarCargo(Cargo cargo) {
        this.cargos.add(cargo);
    }

    public void removerCargo(Cargo cargo) {
        this.cargos.remove(cargo);
    }

    // Getters y setters para hojaDeVidaURL (con mayúsculas)
    public String getHojaDeVidaUrl() {
        return hojaDeVidaURL;
    }

    public void setHojaDeVidaUrl(String hojaDeVidaUrl) {
        this.hojaDeVidaURL = hojaDeVidaUrl;
    }

}