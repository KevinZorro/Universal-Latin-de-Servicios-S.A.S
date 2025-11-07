package com.ufps.Universal.Latin.De.Servicios.S.A.S.controller;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO.GerenteDto;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Gerente;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.service.GerenteService;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/gerentes")
// @CrossOrigin(origins = "http://localhost:3000")
public class GerenteController {

    private final GerenteService gerenteService;

    public GerenteController(GerenteService gerenteService) {
        this.gerenteService = gerenteService;
    }

    @GetMapping
    public List<GerenteDto> getAllGerentes() {
        return gerenteService.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public GerenteDto getGerenteById(@PathVariable String id) {
        Optional<Gerente> gerente = gerenteService.findById(id);
        return gerente.map(this::toDto).orElse(null);
    }

    @PostMapping
    public GerenteDto createGerente(@Valid @RequestBody GerenteDto gerenteDto) {
        Gerente gerente = toEntity(gerenteDto);
        Gerente saved = gerenteService.save(gerente);
        return toDto(saved);
    }

    @PutMapping("/{id}")
    public GerenteDto updateGerente(@PathVariable String id, @Valid @RequestBody GerenteDto gerenteDto) {
        Gerente gerente = toEntity(gerenteDto);
        gerente.setCedula(id);
        Gerente updated = gerenteService.save(gerente);
        return toDto(updated);
    }

    @DeleteMapping("/{id}")
    public void deleteGerente(@PathVariable String id) {
        gerenteService.deleteById(id);
    }

    // Métodos de conversión
    private GerenteDto toDto(Gerente gerente) {
        GerenteDto dto = new GerenteDto();
        return dto;
    }

    private Gerente toEntity(GerenteDto dto) {
        return Gerente.builder()
                .build();
    }

}
