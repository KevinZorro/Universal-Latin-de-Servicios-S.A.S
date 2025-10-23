package com.ufps.Universal.Latin.De.Servicios.S.A.S.repository;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    // puedes agregar métodos custom si es necesario
}
