package com.ufps.Universal.Latin.De.Servicios.S.A.S.controller;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO.EmpleadoUpdateDto;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Empleado;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.service.EmpleadoPerfilService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/empleado/perfil")
@CrossOrigin(origins = "http://localhost:5173")
public class EmpleadoPerfilController {

    @Autowired
    private EmpleadoPerfilService empleadoPerfilService;

    /**
     * Obtener información del perfil del empleado
     * GET /api/empleado/perfil/{cedula}
     */
    @GetMapping("/{cedula}")
    public ResponseEntity<?> obtenerPerfil(@PathVariable String cedula) {
        try {
            Optional<Empleado> empleado = empleadoPerfilService.obtenerPerfil(cedula);

            if (empleado.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Empleado no encontrado"));
            }

            // Crear respuesta sin exponer información sensible
            Empleado emp = empleado.get();
            Map<String, Object> response = Map.of(
                    "cedula", emp.getCedula(),
                    "nombre", emp.getNombre(),
                    "apellido", emp.getApellido(),
                    "telefono", emp.getTelefono() != null ? emp.getTelefono() : "",
                    "email", emp.getEmail(),
                    "hojaDeVidaUrl", emp.getHojaDeVidaUrl() != null ? emp.getHojaDeVidaUrl() : "",
                    "activo", emp.getActivo(),
                    "fechaIngreso", emp.getFechaIngreso());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al obtener perfil: " + e.getMessage()));
        }
    }

    /**
     * Actualizar información del perfil del empleado
     * PUT /api/empleado/perfil/{cedula}
     */
    @PutMapping("/{cedula}")
    public ResponseEntity<?> actualizarPerfil(
            @PathVariable String cedula,
            @Valid @RequestBody EmpleadoUpdateDto dto) {
        try {
            Empleado empleadoActualizado = empleadoPerfilService.actualizarPerfil(cedula, dto);

            return ResponseEntity.ok(Map.of(
                    "message", "Perfil actualizado exitosamente",
                    "empleado", Map.of(
                            "cedula", empleadoActualizado.getCedula(),
                            "nombre", empleadoActualizado.getNombre(),
                            "apellido", empleadoActualizado.getApellido(),
                            "telefono", empleadoActualizado.getTelefono(),
                            "email", empleadoActualizado.getEmail(),
                            "hojaDeVidaUrl",
                            empleadoActualizado.getHojaDeVidaUrl() != null ? empleadoActualizado.getHojaDeVidaUrl()
                                    : "")));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al actualizar perfil: " + e.getMessage()));
        }
    }

    /**
     * Actualizar solo la hoja de vida
     * PATCH /api/empleado/perfil/{cedula}/hoja-de-vida
     */
    @PatchMapping("/{cedula}/hoja-de-vida")
    public ResponseEntity<?> actualizarHojaDeVida(
            @PathVariable String cedula,
            @RequestBody Map<String, String> body) {
        try {
            String hojaDeVidaUrl = body.get("hojaDeVidaUrl");

            if (hojaDeVidaUrl == null || hojaDeVidaUrl.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "La URL de la hoja de vida es requerida"));
            }

            Empleado empleado = empleadoPerfilService.actualizarHojaDeVida(cedula, hojaDeVidaUrl);

            return ResponseEntity.ok(Map.of(
                    "message", "Hoja de vida actualizada exitosamente",
                    "hojaDeVidaUrl", empleado.getHojaDeVidaUrl()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al actualizar hoja de vida: " + e.getMessage()));
        }
    }

    /**
     * Cambiar contraseña
     * POST /api/empleado/perfil/{cedula}/cambiar-password
     */
    @PostMapping("/{cedula}/cambiar-password")
    public ResponseEntity<?> cambiarPassword(
            @PathVariable String cedula,
            @RequestBody Map<String, String> body) {
        try {
            String passwordActual = body.get("passwordActual");
            String passwordNueva = body.get("passwordNueva");

            if (passwordActual == null || passwordActual.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "La contraseña actual es requerida"));
            }

            if (passwordNueva == null || passwordNueva.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "La contraseña nueva es requerida"));
            }

            if (passwordNueva.length() < 6) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "La contraseña debe tener al menos 6 caracteres"));
            }

            empleadoPerfilService.cambiarPassword(cedula, passwordActual, passwordNueva);

            return ResponseEntity.ok(Map.of("message", "Contraseña actualizada exitosamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al cambiar contraseña: " + e.getMessage()));
        }
    }
}