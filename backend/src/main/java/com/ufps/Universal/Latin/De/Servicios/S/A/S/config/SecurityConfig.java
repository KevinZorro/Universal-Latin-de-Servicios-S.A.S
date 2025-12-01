package com.ufps.Universal.Latin.De.Servicios.S.A.S.config;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.security.JwtFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import static org.springframework.security.config.Customizer.withDefaults;
import java.util.Arrays;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

@Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(withDefaults()) // 1. CORRECCIÓN CORS
                .csrf(csrf -> csrf.disable())
                // ...
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("/h2-console/**").permitAll()
                        .requestMatchers("/api/servicios").permitAll() // 2. CORRECCIÓN 403
                        .requestMatchers("/empleados/**").hasAuthority("GERENTE")
                        .anyRequest().permitAll()) // Sugerencia: Usar authenticated() si hay rutas privadas
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    
    // Configuración para permitir TODOS los orígenes (Depuración)
    // Nota: Es mejor usar setAllowedOrigins. Aunque setAllowedOriginPatterns funciona
    // con listas de patrones, el patrón "*" simple puede causar problemas con credentials.
    
    config.setAllowedOriginPatterns(Arrays.asList("*")); // Permite cualquier URL (temporal)
    
    config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
    config.setAllowedHeaders(Arrays.asList("*"));
    
    // IMPORTANTE: Si usas setAllowedOrigins("*") NO puedes usar setAllowCredentials(true).
    // Si usas setAllowedOriginPatterns("*") SÍ puedes usar setAllowCredentials(true), 
    // pero requiere que el filtro JWT esté funcionando correctamente.
    config.setAllowCredentials(true); 

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return source;
}

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
