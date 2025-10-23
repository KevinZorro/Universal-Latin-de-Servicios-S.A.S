package com.ufps.Universal.Latin.De.Servicios.S.A.S.controller;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO.LoginDto;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO.RegistroDto;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Usuario;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }


    @PostMapping("/registro")
    public ResponseEntity<?> register(@RequestBody @Valid RegistroDto dto) {
        Usuario u = authService.registrar(dto);
        return ResponseEntity.ok().body("Usuario registrado: " + u.getCedula());
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginDto dto) {
        // Lógica: validar usuario y password, devolver token/estado
        return ResponseEntity.ok().body("Login exitoso para el usuario: " + dto.cedula);
    }
}
