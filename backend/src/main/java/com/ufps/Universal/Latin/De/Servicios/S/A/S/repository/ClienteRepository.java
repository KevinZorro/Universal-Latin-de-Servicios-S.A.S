package com.ufps.Universal.Latin.De.Servicios.S.A.S.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Cliente;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Integer> {
    Optional<Cliente> findByEmail(String email);
    Optional<Cliente> findByNit(int nit);
}
