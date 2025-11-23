package com.ufps.Universal.Latin.De.Servicios.S.A.S.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO.ServicioDto;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Categoria;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Servicio;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.repository.CategoriaRepository;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.service.ServicioService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/servicios")
@RequiredArgsConstructor
public class ServicioController {

    private final ServicioService servicioService;
    private final CategoriaRepository categoriaRepository;

    // -------------------------
    // HU-12: Obtener servicios (todos o filtrados por categoría)
    // -------------------------
    @GetMapping
    public ResponseEntity<List<Servicio>> getServicios(
            @RequestParam(required = false) Long categoria
    ) {
        List<Servicio> servicios;

        if (categoria != null) {
            servicios = servicioService.findByCategoria(categoria);
        } else {
            servicios = servicioService.obtenerTodos();
        }

        return ResponseEntity.ok(servicios);
    }

    // Obtener un servicio por id
    @GetMapping("/{id}")
    public ResponseEntity<Servicio> getServicioById(@PathVariable int id) {
        try {
            Servicio servicio = servicioService.obtenerPorId(id)
                    .orElseThrow(() -> new IllegalArgumentException("No existe el servicio"));
            return ResponseEntity.ok(servicio);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Conversor DTO a Entidad
    private Servicio toEntity(ServicioDto dto) {
    Servicio servicio = new Servicio();
    servicio.setNombreServicio(dto.getNombreServicio());
    servicio.setDescripcion(dto.getDescripcion());
    servicio.setEstado(dto.isEstado());
    servicio.setTipoHorario(dto.getTipoHorario());

    if (dto.getCategoriaId() != null) {
        Categoria categoria = categoriaRepository.findById(dto.getCategoriaId())
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada"));
        servicio.setCategoria(categoria);
    }

    return servicio;
}


    // Crear servicio
    @PostMapping("/crear")
    @PreAuthorize("hasAuthority('GERENTE')")
    public ResponseEntity<Servicio> createServicio(@Valid @RequestBody ServicioDto dto) {
        try {
            Servicio servicio = toEntity(dto);

            // Asignar categoría si viene en el DTO
            if (dto.getCategoriaId() != null) {
                Categoria categoria = categoriaRepository.findById(dto.getCategoriaId())
                        .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada"));
                servicio.setCategoria(categoria);
            }

            Servicio nuevo = servicioService.crearServicio(servicio);
            return ResponseEntity.ok(nuevo);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }


    // Actualizar servicio
    @PutMapping("/actualizar/{id}")
    @PreAuthorize("hasAuthority('GERENTE')")
    public ResponseEntity<Servicio> updateServicio(
            @PathVariable int id,
            @Valid @RequestBody ServicioDto dto) {

        try {
            Servicio actualizado = servicioService.actualizarServicio(
                    id,
                    dto.getNombreServicio(),
                    dto.getDescripcion(),
                    dto.isEstado(),
                    dto.getTipoHorario()
            ).orElseThrow(() -> new IllegalArgumentException("No existe el servicio"));

            // Actualizar categoría si viene incluida
            if (dto.getCategoriaId() != null) {
                Categoria categoria = categoriaRepository.findById(dto.getCategoriaId())
                        .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada"));
                actualizado.setCategoria(categoria);
            }

            // 🔥 FALTABA ESTO 🔥
            servicioService.crearServicio(actualizado);

            return ResponseEntity.ok(actualizado);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }



    // Eliminar servicio
    @DeleteMapping("/eliminar/{id}")
    @PreAuthorize("hasAuthority('GERENTE')")
    public ResponseEntity<Void> deleteServicio(@PathVariable int id) {
        try {
            servicioService.eliminarServicio(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
