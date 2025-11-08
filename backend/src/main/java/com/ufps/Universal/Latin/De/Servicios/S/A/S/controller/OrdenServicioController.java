package com.ufps.Universal.Latin.De.Servicios.S.A.S.controller;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO.OrdenServicioDto;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Orden_Servicio;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Servicio;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Orden;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Estado;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.service.OrdenServicioService;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.service.ServicioService;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.service.OrdenService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
        Orden_Servicio entity = toEntity(dto);
        Orden_Servicio saved = ordenServicioService.save(entity);
        return toDto(saved);
    }

    @DeleteMapping("/{id}")
    public void deleteOrdenServicio(@PathVariable int id) {
        ordenServicioService.deleteById(id);
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
        entity.setId(dto.getId());
        if(dto.getServicioId() != 0) {
            Optional<Servicio> srv = servicioService.obtenerPorId(dto.getServicioId());
            srv.ifPresent(entity::setServicio);
        }
        if(dto.getOrdenId() != 0) {
            Optional<Orden> ord = ordenService.findById(dto.getOrdenId());
            ord.ifPresent(entity::setOrden);
        }
        if(dto.getEstado() != null){
            entity.setEstado(Estado.valueOf(dto.getEstado()));
        }
        return entity;
    }
}
