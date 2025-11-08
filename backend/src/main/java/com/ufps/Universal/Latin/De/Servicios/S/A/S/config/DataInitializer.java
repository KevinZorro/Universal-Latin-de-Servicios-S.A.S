package com.ufps.Universal.Latin.De.Servicios.S.A.S.config;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Cliente;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.repository.ClienteRepository;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Empleado;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Gerente;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Rol;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.repository.EmpleadoRepository;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.repository.GerenteRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(
            EmpleadoRepository empleadoRepository,
            GerenteRepository gerenteRepository,
            ClienteRepository clienteRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            boolean sinGerentes = gerenteRepository.count() == 0;
            boolean sinEmpleados = empleadoRepository.count() == 0;
            boolean sinClientes = clienteRepository.count() == 0;

                                Cliente cliente1 = new Cliente();
                    cliente1.setNombre("Pedro Gómez");
                    cliente1.setTelefono("3104567890");
                    cliente1.setDireccion("Cra 12 #34-56");
                    cliente1.setNit(900111222);
                    cliente1.setEmail("pedro.gomez@mail.com");
                    cliente1.setCiudad("Cúcuta");
                    clienteRepository.save(cliente1);

                    Cliente cliente2 = new Cliente();
                    cliente2.setNombre("Laura Rodríguez");
                    cliente2.setTelefono("3139876543");
                    cliente2.setDireccion("Av. El Llano #89-10");
                    cliente2.setNit(900333444);
                    cliente2.setEmail("laura.rodriguez@mail.com");
                    cliente2.setCiudad("Bucaramanga");
                    clienteRepository.save(cliente2);

                    System.out.println("✅ Clientes iniciales creados.");

            if (sinGerentes || sinEmpleados || sinClientes) {
                System.out.println("🚀 Inicializando datos por defecto...");

                // ==== Crear Gerente ====
                if (sinGerentes) {
                    Gerente gerente = new Gerente();
                    gerente.setCedula("1001");
                    gerente.setNombre("Gerente Zorro");
                    gerente.setApellido("Zorro");
                    gerente.setTelefono("3011234567");
                    gerente.setEmail("gerente@empresa.com");
                    gerente.setPasswordHash(passwordEncoder.encode("admin123"));
                    gerente.setRol(Rol.GERENTE);
                    gerenteRepository.save(gerente);
                    System.out.println("✅ Gerente inicial creado.");
                }

                // ==== Crear Empleado ====
                if (sinEmpleados) {
                    Empleado empleado = new Empleado();
                    empleado.setCedula("2001");
                    empleado.setNombre("Empleado Prueba");
                    empleado.setApellido("Prueba");
                    empleado.setTelefono("3001234567");
                    empleado.setEmail("empleado@empresa.com");
                    empleado.setPasswordHash(passwordEncoder.encode("empleado123"));
                    empleado.setRol(Rol.EMPLEADO);
                    empleado.setActivo(true);
                    empleado.setFechaIngreso(LocalDate.now());
                    empleadoRepository.save(empleado);
                    System.out.println("✅ Empleado inicial creado.");
                }

                if (sinClientes) {
                    Cliente cliente3 = new Cliente();
                    cliente1.setNombre("Pedro Gómez");
                    cliente1.setTelefono("3104567890");
                    cliente1.setDireccion("Cra 12 #34-56");
                    cliente1.setNit(900111222);
                    cliente1.setEmail("pedro.gomez@mail.com");
                    cliente1.setCiudad("Cúcuta");
                    clienteRepository.save(cliente1);

                    Cliente cliente4 = new Cliente();
                    cliente2.setNombre("Laura Rodríguez");
                    cliente2.setTelefono("3139876543");
                    cliente2.setDireccion("Av. El Llano #89-10");
                    cliente2.setNit(900333444);
                    cliente2.setEmail("laura.rodriguez@mail.com");
                    cliente2.setCiudad("Bucaramanga");
                    clienteRepository.save(cliente2);

                    System.out.println("✅ Clientes iniciales creados.");
                }
            } else {
                System.out.println("ℹ️ Los datos iniciales ya existen. No se insertaron nuevos registros.");
            }
        };
    }
}
