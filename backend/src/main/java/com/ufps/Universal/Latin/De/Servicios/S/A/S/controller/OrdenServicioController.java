package com.ufps.Universal.Latin.De.Servicios.S.A.S.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO.OrdenServicioDto;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Estado;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Orden;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Orden_Servicio;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Servicio;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.service.OrdenService;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.service.OrdenServicioService;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.service.ServicioService;

@RestController
@RequestMapping("/api/ordenes-servicio")
public class OrdenServicioController {

    private final OrdenServicioService ordenServicioService;
    private final ServicioService servicioService;
    private final OrdenService ordenService;

    public OrdenServicioController(OrdenServicioService ordenServicioService,
                                   ServicioService servicioService,
                                   OrdenService ordenService) {
        this.ordenServicioService = ordenServicioService;
        this.servicioService = servicioService;
        this.ordenService = ordenService;
    }

    // ======================== GET ALL ===========================
    @GetMapping
    public List<OrdenServicioDto> getAll() {
        return ordenServicioService.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    // ======================== GET BY ID =========================
    @GetMapping("/{id}")
    public OrdenServicioDto getById(@PathVariable int id) {
        return ordenServicioService.findById(id)
                .map(this::toDto)
                .orElse(null);
    }

    // ======================== CREATE ============================
    @PostMapping
    public OrdenServicioDto create(@RequestBody OrdenServicioDto dto) {
        Orden_Servicio entity = toEntity(dto);
        Orden_Servicio saved = ordenServicioService.save(entity);
        return toDto(saved);
    }

    // ======================== DELETE ============================
    @DeleteMapping("/{id}")
    public void delete(@PathVariable int id) {
        ordenServicioService.deleteById(id);
    }

    // ======================== UPDATE ESTADO =====================
    @PatchMapping("/{id}/estado")
    public OrdenServicioDto updateEstado(@PathVariable int id, @RequestParam String nuevoEstado) {
        Orden_Servicio os = ordenServicioService.findById(id)
                .orElseThrow(() -> new RuntimeException("Orden Servicio no encontrada"));

        try {
            os.setEstado(Estado.valueOf(nuevoEstado));
        } catch (Exception e) {
            throw new RuntimeException("Estado inválido: " + nuevoEstado);
        }

        return toDto(ordenServicioService.save(os));
    }

    // ======================== PUT COMPLETO ======================
    @PutMapping("/{id}")
    public OrdenServicioDto update(@PathVariable int id, @RequestBody OrdenServicioDto dto) {

        Orden_Servicio existente = ordenServicioService.findById(id)
                .orElseThrow(() -> new RuntimeException("OrdenServicio no encontrada"));

        if (dto.getServicioId() != null) {
            Servicio servicio = servicioService.obtenerPorId(dto.getServicioId())
                    .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));
            existente.setServicio(servicio);
        }

        if (dto.getOrdenId() != null) {
            Orden orden = ordenService.findById(dto.getOrdenId())
                    .orElseThrow(() -> new RuntimeException("Orden no encontrada"));
            existente.setOrden(orden);
        }

        if (dto.getEstado() != null) {
            try {
                existente.setEstado(Estado.valueOf(dto.getEstado()));
            } catch (Exception e) {
                throw new RuntimeException("Estado inválido: " + dto.getEstado());
            }
        }

        Orden_Servicio actualizado = ordenServicioService.save(existente);
        return toDto(actualizado);
    }

    // ======================== HELPERS ===========================
    private OrdenServicioDto toDto(Orden_Servicio os) {
        OrdenServicioDto dto = new OrdenServicioDto();
        dto.setId(os.getId());
        dto.setServicioId(os.getServicio() != null ? os.getServicio().getId() : null);
        dto.setOrdenId(os.getOrden() != null ? os.getOrden().getIdOrden() : null);
        dto.setEstado(os.getEstado() != null ? os.getEstado().name() : null);
        return dto;
    }

    private Orden_Servicio toEntity(OrdenServicioDto dto) {
        Orden_Servicio entity = new Orden_Servicio();

        if (dto.getServicioId() != null) {
            servicioService.obtenerPorId(dto.getServicioId())
                    .ifPresent(entity::setServicio);
        }
        if (dto.getOrdenId() != null) {
            ordenService.findById(dto.getOrdenId())
                    .ifPresent(entity::setOrden);
        }
        if (dto.getEstado() != null) {
            entity.setEstado(Estado.valueOf(dto.getEstado()));
        }

        return entity;
    }
}
