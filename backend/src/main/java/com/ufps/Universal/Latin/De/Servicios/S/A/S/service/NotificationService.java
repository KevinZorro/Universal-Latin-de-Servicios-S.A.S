package com.ufps.Universal.Latin.De.Servicios.S.A.S.service;

import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    // Aquí puedes integrar email, push, sockets, etc.
    public void notifyEmpleadoAsignado(String cedula, String mensaje) {
        // placeholder: log o integracion real
        System.out.println("NOTIFICACION -> Empleado: " + cedula + " | Mensaje: " + mensaje);
    }

    public void notifyEmpleadoDesasignado(String cedula, String mensaje) {
        System.out.println("NOTIFICACION -> Empleado: " + cedula + " | Mensaje: " + mensaje);
    }
}