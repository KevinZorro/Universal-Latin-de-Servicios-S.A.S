package com.ufps.Universal.Latin.De.Servicios.S.A.S.model;

import java.util.HashSet;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Set;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "cargo")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cargo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @ManyToMany(mappedBy = "cargos")
    @JsonIgnore
    @Builder.Default
    private Set<Empleado> empleados = new HashSet<>();


}
