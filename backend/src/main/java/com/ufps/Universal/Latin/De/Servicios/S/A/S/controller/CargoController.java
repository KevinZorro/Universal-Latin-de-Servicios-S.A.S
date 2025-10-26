package com.ufps.Universal.Latin.De.Servicios.S.A.S.controller;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Cargo;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.service.CargoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.IanaLinkRelations;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@RestController
@RequestMapping("/api/tipos-empleado")
@RequiredArgsConstructor
public class CargoController {
    
    private final CargoService cargoService;

    @PostMapping
    public ResponseEntity<EntityModel<Cargo>> crearCargo(@Valid @RequestBody Cargo cargo) {
        Cargo created = cargoService.crearCargo(cargo);
        EntityModel<Cargo> entityModel = EntityModel.of(created,
                linkTo(methodOn(CargoController.class).obtenerCargoPorId(created.getId())).withSelfRel(),
                linkTo(methodOn(CargoController.class).obtenerTodosTiposEmpleado()).withRel("tipos-empleado"));

        return ResponseEntity
                .created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri())
                .body(entityModel);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EntityModel<Cargo>> obtenerCargoPorId(@PathVariable int id) {
        Cargo cargo = cargoService.obtenerCargoPorId(id);
        EntityModel<Cargo> entityModel = EntityModel.of(cargo,
                linkTo(methodOn(CargoController.class).obtenerCargoPorId(id)).withSelfRel(),
                linkTo(methodOn(CargoController.class).obtenerTodosTiposEmpleado()).withRel("tipos-empleado"));

        return ResponseEntity.ok(entityModel);
    }

    @GetMapping
    public ResponseEntity<CollectionModel<EntityModel<Cargo>>> obtenerTodosTiposEmpleado() {
        List<EntityModel<Cargo>> tiposEmpleado = cargoService.obtenerTodosCargos()
                .stream()
                .map(tipo -> EntityModel.of(tipo,
                        linkTo(methodOn(CargoController.class).obtenerCargoPorId(tipo.getId())).withSelfRel(),
                        linkTo(methodOn(CargoController.class).obtenerTodosTiposEmpleado()).withRel("tipos-empleado")))
                .collect(Collectors.toList());

        CollectionModel<EntityModel<Cargo>> collectionModel = CollectionModel.of(tiposEmpleado,
                linkTo(methodOn(CargoController.class).obtenerTodosTiposEmpleado()).withSelfRel());

        return ResponseEntity.ok(collectionModel);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EntityModel<Cargo>> actualizarCargo(
            @PathVariable int id,
            @Valid @RequestBody Cargo cargoData) {
        Cargo updated = cargoService.actualizarCargo(id, cargoData);
        EntityModel<Cargo> entityModel = EntityModel.of(updated,
                linkTo(methodOn(CargoController.class).obtenerCargoPorId(id)).withSelfRel(),
                linkTo(methodOn(CargoController.class).obtenerTodosTiposEmpleado()).withRel("tipos-empleado"));

        return ResponseEntity.ok(entityModel);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarCargo(@PathVariable int id) {
        cargoService.eliminarCargo(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/buscar")
    public ResponseEntity<EntityModel<Cargo>> buscarPorNombre(@RequestParam String nombre) {
        Cargo cargo = cargoService.obtenerCargoPorNombre(nombre);
        EntityModel<Cargo> entityModel = EntityModel.of(cargo,
                linkTo(methodOn(CargoController.class).obtenerCargoPorId(cargo.getId())).withSelfRel(),
                linkTo(methodOn(CargoController.class).obtenerTodosTiposEmpleado()).withRel("tipos-empleado"));

        return ResponseEntity.ok(entityModel);
    }
}
