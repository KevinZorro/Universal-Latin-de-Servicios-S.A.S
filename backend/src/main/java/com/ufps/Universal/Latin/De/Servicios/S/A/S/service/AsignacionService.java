package com.ufps.Universal.Latin.De.Servicios.S.A.S.service;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Asignacion;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.repository.AsignacionRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class AsignacionService {

    private final AsignacionRepository asignacionRepository;

    public AsignacionService(AsignacionRepository asignacionRepository) {
        this.asignacionRepository = asignacionRepository;
    }

    public List<Asignacion> findAll() { return asignacionRepository.findAll(); }

    public Optional<Asignacion> findById(int id) { return asignacionRepository.findById(id); }

    public Asignacion save(Asignacion asignacion) { return asignacionRepository.save(asignacion); }

    public void deleteById(int id) { asignacionRepository.deleteById(id); }

    // Implementación de lógica adicional según los métodos de tu diagrama
//    public boolean validarDisponibilidad(Empleado empleado, Date fecha) {
//        // Aquí puedes validar la disponibilidad según tu lógica de negocio
//        // Ejemplo simplificado:
//        return asignacionRepository.findAll().stream()
//            .noneMatch(a -> a.getEmpleado().getId() == empleado.getId() 
//                         && a.getFechaAsignacion().equals(fecha));
//    }
//
//    public void notificarEmpleado(Empleado empleado, String mensaje) {
//        // Lógica de notificación (puede ser por email, SMS, etc.)
//        // Aquí solo va un placeholder
//        System.out.println("Notificando a empleado " + empleado.getNombre() + ": " + mensaje);
//    }
}
