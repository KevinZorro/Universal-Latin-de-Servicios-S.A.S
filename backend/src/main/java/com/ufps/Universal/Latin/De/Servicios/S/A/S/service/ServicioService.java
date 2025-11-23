package com.ufps.Universal.Latin.De.Servicios.S.A.S.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Servicio;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.repository.ServicioRepository;

@Service
public class ServicioService {

    @Autowired
    private ServicioRepository servicioRepository;

    public List<Servicio> obtenerTodos() {
        return servicioRepository.findAll();
    }

    public Optional<Servicio> obtenerPorId(int id) {
        return servicioRepository.findById(id);
    }

    // Crear servicio con datos sueltos
    public Servicio crearServicio(Servicio s) {
        return servicioRepository.save(s);
    }

    // Actualizar servicio existente con datos sueltos
    public Optional<Servicio> actualizarServicio(int id, String nombreServicio, String descripcion, boolean estado, String tipoHorario) {
        Optional<Servicio> opt = servicioRepository.findById(id);
        if (opt.isPresent()) {
            Servicio s = opt.get();
            s.setNombreServicio(nombreServicio);
            s.setDescripcion(descripcion);
            s.setEstado(estado);
            s.setTipoHorario(tipoHorario);
            servicioRepository.save(s);
            return Optional.of(s);
        } else {
            return Optional.empty();
        }
    }

    public void eliminarServicio(int id) {
        servicioRepository.deleteById(id);
    }

    public List<Servicio> findByCategoria(Long categoriaId) {
    return servicioRepository.findByCategoriaId(categoriaId);
}

}
