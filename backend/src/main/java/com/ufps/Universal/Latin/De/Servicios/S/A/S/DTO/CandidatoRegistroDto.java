package com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CandidatoRegistroDto {
    private String cedula;
    private String nombre;
    private String apellido;
    private String email;
    private String telefono;
    private String posicion;
    private String experiencia;
    private String mensaje;
    private MultipartFile hojaDeVida;
}