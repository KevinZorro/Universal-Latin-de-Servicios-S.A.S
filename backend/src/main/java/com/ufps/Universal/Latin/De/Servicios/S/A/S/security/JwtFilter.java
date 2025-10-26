package com.ufps.Universal.Latin.De.Servicios.S.A.S.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();

        // Permitir preflight y endpoints públicos sin validar token
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())
                || path.startsWith("/auth/")
                || path.startsWith("/h2-console/")) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            // No hay token: dejar que la cadena de seguridad decida (por ejemplo, endpoints permitAll)
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {
            if (!jwtUtil.validarToken(token)) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\":\"Token inválido o expirado\"}");
                return;
            }

            // Token válido: extraer datos y crear Authentication
            String cedula = jwtUtil.obtenerCedula(token);
            String rol = jwtUtil.obtenerRol(token); // espera algo como "GERENTE"

            List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(rol));
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(cedula, null, authorities);

            SecurityContextHolder.getContext().setAuthentication(authentication);

            // seguir con la cadena de filtros
            filterChain.doFilter(request, response);
        } catch (Exception ex) {
            // En caso de error inesperado al parsear/validar token
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"Error al validar token\"}");
        }
    }
}
