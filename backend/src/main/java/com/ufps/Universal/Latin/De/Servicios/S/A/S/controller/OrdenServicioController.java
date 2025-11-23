package com.ufps.Universal.Latin.De.Servicios.S.A.S.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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

    public OrdenServicioController(OrdenServicioService ordenServicioService, ServicioService servicioService, OrdenService ordenService) {
        this.ordenServicioService = ordenServicioService;
        this.servicioService = servicioService;
        this.ordenService = ordenService;
    }

    @GetMapping
    public List<OrdenServicioDto> getAllOrdenServicios() {
        return ordenServicioService.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public OrdenServicioDto getOrdenServicioById(@PathVariable int id) {
        Optional<Orden_Servicio> ordenServicio = ordenServicioService.findById(id);
        return ordenServicio.map(this::toDto).orElse(null);
    }

    @PostMapping
    public OrdenServicioDto createOrdenServicio(@RequestBody OrdenServicioDto dto) {
    System.out.println("Creating Orden_Servicio with DTO: " + dto.getOrdenId() + " - " + dto.getServicioId());

    Orden_Servicio os = toEntity(dto);
    Orden_Servicio savedOs = ordenServicioService.save(os);

    return toDto(savedOs);
}

    @DeleteMapping("/{id}")
    public void deleteOrdenServicio(@PathVariable int id) {
        ordenServicioService.deleteById(id);
    }

    @PatchMapping("/{id}/estado")
    public OrdenServicioDto updateEstado(@PathVariable int id, @RequestParam String nuevoEstado) {
        Optional<Orden_Servicio> ordenServicioOpt = ordenServicioService.findById(id);
        
        if (ordenServicioOpt.isPresent()) {
            Orden_Servicio os = ordenServicioOpt.get();
            // Asegúrate de que el String coincida con tu Enum (PENDIENTE, EN_PROCESO, FINALIZADO, etc.)
            try {
                os.setEstado(Estado.valueOf(nuevoEstado));
                Orden_Servicio updatedOs = ordenServicioService.save(os);
                return toDto(updatedOs);
            } catch (IllegalArgumentException e) {
                // Manejo si envían un estado que no existe en el Enum
                throw new RuntimeException("Estado inválido: " + nuevoEstado);
            }
        } else {
            throw new RuntimeException("Orden de servicio no encontrada con ID: " + id);
        }
    }

    // Helpers
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

    if (dto.getServicioId() != null && dto.getServicioId() != 0) {
        Optional<Servicio> srv = servicioService.obtenerPorId(dto.getServicioId());
        srv.ifPresent(entity::setServicio);
    }

    // 2. Manejo de Orden
    if (dto.getOrdenId() != null && dto.getOrdenId() != 0) {
        Optional<Orden> ord = ordenService.findById(dto.getOrdenId());
        ord.ifPresent(entity::setOrden);
    }
    // 3. Manejo de Estado
    if (dto.getEstado() != null) {
        entity.setEstado(Estado.valueOf(dto.getEstado()));
    }
    
    return entity;
}

}
