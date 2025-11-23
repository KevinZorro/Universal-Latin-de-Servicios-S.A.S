package com.ufps.Universal.Latin.De.Servicios.S.A.S.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO.RegistroDto;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Cargo;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Empleado;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.repository.CargoRepository;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.repository.EmpleadoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class EmpleadoService {

    private final EmpleadoRepository empleadoRepository;
    private final CargoRepository cargoRepository;
    private final AuthService authService;

    public Empleado crearEmpleado(Empleado empleado) {
        // Convertimos los datos del Empleado a un RegistroDto
        RegistroDto dto = new RegistroDto();
        dto.setCedula(empleado.getCedula());
        dto.setNombre(empleado.getNombre());
        dto.setApellido(empleado.getApellido());
        dto.setTelefono(empleado.getTelefono());
        dto.setEmail(empleado.getEmail());
        dto.setPassword(empleado.getPasswordHash()); // 🔒 Podrías asignar una contraseña temporal
        dto.setRol("EMPLEADO");

        // Usar el AuthService para registrar correctamente
        Empleado nuevoEmpleado = (Empleado) authService.registrar(dto);

        // Si quieres agregar cargos o campos adicionales:
        nuevoEmpleado.setFechaIngreso(empleado.getFechaIngreso());
        nuevoEmpleado.setActivo(empleado.getActivo());

        // Guardar con campos adicionales actualizados
        return empleadoRepository.save(nuevoEmpleado);
    }

    @Transactional(readOnly = true)
    public Empleado obtenerEmpleadoPorId(String cedula) {
        return empleadoRepository.findById(cedula)
                .orElseThrow(() -> new IllegalArgumentException("Empleado no encontrado con cédula: " + cedula));
    }

    @Transactional(readOnly = true)
    public List<Empleado> obtenerTodosEmpleados() {
        return empleadoRepository.findAll();
    }

    // ================== RELACIÓN EMPLEADO - CARGO ==================
    public Empleado agregarCargoAEmpleado(String empleadoId, int cargoId) {
        Empleado empleado = empleadoRepository.findById(empleadoId)
                .orElseThrow(() -> new IllegalArgumentException("Empleado no encontrado"));

        Cargo cargo = cargoRepository.findById(cargoId)
                .orElseThrow(() -> new IllegalArgumentException("Cargo no encontrado"));

        empleado.agregarCargo(cargo); // Este método debe existir en tu entidad Empleado
        return empleadoRepository.save(empleado);
    }

    public Empleado removerCargoDeEmpleado(String empleadoId, int cargoId) {
        Empleado empleado = empleadoRepository.findById(empleadoId)
                .orElseThrow(() -> new IllegalArgumentException("Empleado no encontrado"));

        Cargo cargo = cargoRepository.findById(cargoId)
                .orElseThrow(() -> new IllegalArgumentException("Cargo no encontrado"));

        empleado.removerCargo(cargo); // Este método debe existir en tu entidad Empleado
        return empleadoRepository.save(empleado);
    }

    @Transactional(readOnly = true)
    public List<Empleado> obtenerEmpleadosPorCargo(int cargoId) {
        return empleadoRepository.findEmpleadosByCargoId(cargoId);
    }

public Empleado actualizarEmpleado(String cedula, Empleado datosActualizados) {
    Empleado empleado = empleadoRepository.findById(cedula)
            .orElseThrow(() -> new IllegalArgumentException("Empleado no encontrado con cédula: " + cedula));

    if (datosActualizados.getNombre() != null) {
        empleado.setNombre(datosActualizados.getNombre());
    }
    if (datosActualizados.getApellido() != null) {
        empleado.setApellido(datosActualizados.getApellido());
    }
    if (datosActualizados.getTelefono() != null) {
        empleado.setTelefono(datosActualizados.getTelefono());
    }
    if (datosActualizados.getEmail() != null) {
        empleado.setEmail(datosActualizados.getEmail());
    }
    if (datosActualizados.getActivo() != null) {
        empleado.setActivo(datosActualizados.getActivo());
    }
    if (datosActualizados.getFechaIngreso() != null) {
        empleado.setFechaIngreso(datosActualizados.getFechaIngreso());
    }
    if (datosActualizados.getDesprendiblePagoURL() != null) {
        empleado.setDesprendiblePagoURL(datosActualizados.getDesprendiblePagoURL());
    }
    if (datosActualizados.getHojaDeVidaURL() != null) {
        empleado.setHojaDeVidaURL(datosActualizados.getHojaDeVidaURL());
    }
    // Repite para otros campos que puedan ser actualizados.

    return empleadoRepository.save(empleado);
}

public Empleado actualizarPerfilEmpleado(String cedula, Empleado datosActualizados) {
    Empleado empleado = empleadoRepository.findById(cedula)
            .orElseThrow(() -> new IllegalArgumentException("Empleado no encontrado con cédula: " + cedula));

    if (datosActualizados.getNombre() != null) {
        empleado.setNombre(datosActualizados.getNombre());
    }
    if (datosActualizados.getApellido() != null) {
        empleado.setApellido(datosActualizados.getApellido());
    }
    if (datosActualizados.getTelefono() != null) {
        empleado.setTelefono(datosActualizados.getTelefono());
    }
    if (datosActualizados.getEmail() != null) {
        empleado.setEmail(datosActualizados.getEmail());
    }
    return empleadoRepository.save(empleado);
}


    // ================== CRUD DE CARGOS ==================
    public Cargo crearCargo(Cargo cargo) {
        if (cargo.getNombre() == null || cargo.getNombre().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre del cargo no puede estar vacío");
        }

        if (cargoRepository.findByNombre(cargo.getNombre()).isPresent()) {
            throw new IllegalArgumentException("Ya existe un cargo con el nombre: " + cargo.getNombre());
        }

        return cargoRepository.save(cargo);
    }

    public void eliminarCargo(int cargoId) {
        Cargo cargo = cargoRepository.findById(cargoId)
                .orElseThrow(() -> new IllegalArgumentException("Cargo no encontrado con id: " + cargoId));

        List<Empleado> empleadosConCargo = empleadoRepository.findEmpleadosByCargoId(cargoId);

        if (!empleadosConCargo.isEmpty()) {
            throw new IllegalStateException(
                    "No se puede eliminar el cargo '" + cargo.getNombre() +
                            "' porque está asignado a " + empleadosConCargo.size() + " empleado(s)");
        }

        cargoRepository.delete(cargo);
    }

    @Transactional(readOnly = true)
    public List<Cargo> obtenerTodosCargos() {
        return cargoRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Cargo obtenerCargoPorId(int cargoId) {
        return cargoRepository.findById(cargoId)
                .orElseThrow(() -> new IllegalArgumentException("Cargo no encontrado con id: " + cargoId));
    }
}
