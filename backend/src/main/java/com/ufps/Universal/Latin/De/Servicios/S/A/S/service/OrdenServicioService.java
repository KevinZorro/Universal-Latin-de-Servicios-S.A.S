package com.ufps.Universal.Latin.De.Servicios.S.A.S.service;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.OrdenServicio;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Servicio;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.repository.OrdenServicioRepository;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.repository.ServicioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrdenServicioService {

    private final OrdenServicioRepository ordenServicioRepository;
    private final ServicioRepository servicioRepository;

    public List<OrdenServicio> obtenerTodos() {
        return ordenServicioRepository.findAll();
    }

    public Optional<OrdenServicio> obtenerPorId(Integer id) {
        return ordenServicioRepository.findById(id);
    }

    public List<OrdenServicio> obtenerPorOrden(Integer idOrden) {
        return ordenServicioRepository.findByIdOrden(idOrden);
    }

    public List<OrdenServicio> obtenerPorServicio(Integer idServicio) {
        return ordenServicioRepository.findByServicio_IdServicio(idServicio);
    }

    public List<OrdenServicio> obtenerPorEmpleado(Integer idEmpleado) {
        return ordenServicioRepository.findByIdEmpleadoAsignado(idEmpleado);
    }

    public List<OrdenServicio> obtenerPorEstado(String estado) {
        return ordenServicioRepository.findByEstado(estado);
    }

    @Transactional
    public OrdenServicio crearOrdenServicio(Integer idServicio, Integer idOrden,
            Integer idEmpleadoAsignado, String estado) {
        Servicio servicio = servicioRepository.findById(idServicio)
                .orElseThrow(() -> new IllegalArgumentException("El servicio no existe"));

        OrdenServicio ordenServicio = new OrdenServicio();
        ordenServicio.setServicio(servicio);
        ordenServicio.setIdOrden(idOrden);
        ordenServicio.setIdEmpleadoAsignado(idEmpleadoAsignado);
        ordenServicio.setEstado(estado);

        return ordenServicioRepository.save(ordenServicio);
    }

    @Transactional
    public Optional<OrdenServicio> actualizarOrdenServicio(Integer id, Integer idServicio,
            Integer idOrden, Integer idEmpleadoAsignado,
            String estado) {
        return ordenServicioRepository.findById(id).map(ordenServicio -> {
            if (idServicio != null) {
                Servicio servicio = servicioRepository.findById(idServicio)
                        .orElseThrow(() -> new IllegalArgumentException("El servicio no existe"));
                ordenServicio.setServicio(servicio);
            }

            if (idOrden != null) {
                ordenServicio.setIdOrden(idOrden);
            }

            ordenServicio.setIdEmpleadoAsignado(idEmpleadoAsignado);
            ordenServicio.setEstado(estado);

            return ordenServicioRepository.save(ordenServicio);
        });
    }

    @Transactional
    public void eliminarOrdenServicio(Integer id) {
        if (!ordenServicioRepository.existsById(id)) {
            throw new IllegalArgumentException("La orden de servicio no existe");
        }
        ordenServicioRepository.deleteById(id);
    }
}