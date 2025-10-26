package com.ufps.Universal.Latin.De.Servicios.S.A.S.model;

import lombok.*;
import lombok.experimental.SuperBuilder;
import jakarta.persistence.*;

@Entity
@Table(name = "gerente")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@PrimaryKeyJoinColumn(name = "cedula")
public class Gerente extends Usuario {

    private String ejemplo;
}
