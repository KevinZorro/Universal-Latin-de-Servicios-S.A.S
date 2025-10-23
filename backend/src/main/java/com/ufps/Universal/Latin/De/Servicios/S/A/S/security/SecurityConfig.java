package com.ufps.Universal.Latin.De.Servicios.S.A.S.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.springframework.security.config.Customizer.withDefaults;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Deshabilita CSRF para APIs REST (ajustar según necesidad)
                .authorizeHttpRequests(requests -> requests
                        .requestMatchers("/api/auth/**").permitAll() // login y registro abiertos
                        .requestMatchers("/api/empleados/**").hasRole("EMPLEADO")
                        .requestMatchers("/api/gerentes/**").hasRole("GERENTE")
                        .anyRequest().authenticated())
                .httpBasic(withDefaults()); // para pruebas, puedes cambiar a JWT u otro método

        return http.build();
    }
}
