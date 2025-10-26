package com.ufps.Universal.Latin.De.Servicios.S.A.S.service;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Cargo;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.repository.CargoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CargoService {

    private final CargoRepository cargoRepository;

    public Cargo crearCargo(Cargo cargo) {
        if (cargoRepository.existsByNombre(cargo.getNombre())) {
            throw new IllegalArgumentException("Ya existe un cargo con el nombre: " + cargo.getNombre());
        }
        return cargoRepository.save(cargo);
    }

    @Transactional(readOnly = true)
    public Cargo obtenerCargoPorId(int id) {
        return cargoRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("No se encontró el cargo con id: " + id));
    }

    @Transactional(readOnly = true)
    public List<Cargo> obtenerTodosCargos() {
        return cargoRepository.findAll();
    }

    public Cargo actualizarCargo(int id, Cargo cargoData) {
        Cargo cargo = cargoRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("No se encontró el cargo con id: " + id));

        if (!cargo.getNombre().equals(cargoData.getNombre()) 
                && cargoRepository.existsByNombre(cargoData.getNombre())) {
            throw new IllegalArgumentException("Ya existe un cargo con el nombre: " + cargoData.getNombre());
        }

        cargo.setNombre(cargoData.getNombre());
        return cargoRepository.save(cargo);
    }

    public void eliminarCargo(int id) {
        if (!cargoRepository.existsById(id)) {
            throw new IllegalArgumentException("No se encontró el cargo con id: " + id);
        }
        cargoRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public Cargo obtenerCargoPorNombre(String nombre) {
        return cargoRepository.findByNombre(nombre)
            .orElseThrow(() -> new IllegalArgumentException("No se encontró el cargo con nombre: " + nombre));
    }
}
