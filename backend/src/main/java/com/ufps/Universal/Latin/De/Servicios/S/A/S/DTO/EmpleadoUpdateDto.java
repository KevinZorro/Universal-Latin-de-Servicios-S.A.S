package com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO;

import jakarta.validation.constraints.Email;

public class EmpleadoUpdateDto {

    private String telefono;

    @Email(message = "Email inválido")
    private String email;

    private String password; // Nueva contraseña (opcional)

    private String hojaDeVidaUrl;

    private String direccion; // Si tienes este campo en Usuario

    // Constructores
    public EmpleadoUpdateDto() {
    }

    // Getters y Setters
    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getHojaDeVidaUrl() {
        return hojaDeVidaUrl;
    }

    public void setHojaDeVidaUrl(String hojaDeVidaUrl) {
        this.hojaDeVidaUrl = hojaDeVidaUrl;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }
}