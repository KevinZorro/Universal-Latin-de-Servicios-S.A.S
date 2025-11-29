package com.ufps.Universal.Latin.De.Servicios.S.A.S.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.DTO.RegistroDto;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Cargo;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Empleado;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.TipoContrato;
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

    // 1. Validación: la fecha de ingreso no puede ser null
    if (empleado.getFechaIngreso() == null) {
        throw new IllegalArgumentException("La fecha de ingreso es obligatoria.");
    }

    // 2. Validación según el tipo de contrato
    TipoContrato tipoContrato = empleado.getTipoContrato();
    LocalDate ingreso = empleado.getFechaIngreso();
    LocalDate retiro = empleado.getFechaRetiro();

    // Contratos que NO deben tener fecha de retiro
    List<TipoContrato> contratosSinRetiro = List.of(TipoContrato.INDEFINIDO);

    // Contratos que SÍ usan fecha de retiro (ejemplo)
    List<TipoContrato> contratosConRetiro = List.of(TipoContrato.FIJO, TipoContrato.POR_PROYECTO, TipoContrato.TEMPORAL);

    // A) Contrato sin fecha de retiro (ej: INDEFINIDO)
    if (contratosSinRetiro.contains(tipoContrato)) {
        if (retiro != null) {
            throw new IllegalArgumentException(
                "Un contrato de tipo " + tipoContrato + " no debe tener fecha de retiro."
            );
        }
    }

    // B) Contratos que requieren fecha de retiro
    if (contratosConRetiro.contains(tipoContrato)) {
        if (retiro == null) {
            throw new IllegalArgumentException(
                "Un contrato de tipo " + tipoContrato + " requiere una fecha de retiro."
            );
        }

        // Fecha retiro debe ser posterior a ingreso
        if (!retiro.isAfter(ingreso)) {
            throw new IllegalArgumentException(
                "La fecha de retiro debe ser posterior a la fecha de ingreso."
            );
        }
    }

    // 3. Convertimos datos a DTO
    RegistroDto dto = new RegistroDto();
    dto.setCedula(empleado.getCedula());
    dto.setNombre(empleado.getNombre());
    dto.setApellido(empleado.getApellido());
    dto.setTelefono(empleado.getTelefono());
    dto.setEmail(empleado.getEmail());
    dto.setPassword(empleado.getPasswordHash());
    dto.setRol("EMPLEADO");

    // Registro en Auth
    Empleado nuevoEmpleado = (Empleado) authService.registrar(dto);

    // Campos adicionales
    nuevoEmpleado.setFechaIngreso(empleado.getFechaIngreso());
    nuevoEmpleado.setActivo(empleado.getActivo());
    nuevoEmpleado.setTipoContrato(tipoContrato);
    nuevoEmpleado.setFechaRetiro(empleado.getFechaRetiro());

    // Guardar final
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

        if (datosActualizados.getTipoContrato() != null) {
            empleado.setTipoContrato(datosActualizados.getTipoContrato());
        }
        
            empleado.setFechaRetiro(datosActualizados.getFechaRetiro());
        
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
