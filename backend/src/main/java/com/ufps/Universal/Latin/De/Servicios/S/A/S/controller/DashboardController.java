package com.ufps.Universal.Latin.De.Servicios.S.A.S.controller;

import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Empleado;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Estado;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Evidencia;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.model.Servicio;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.service.EvidenciaService;
import com.ufps.Universal.Latin.De.Servicios.S.A.S.service.OrdenServicioService;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.io.FileInputStream;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.ClientAnchor;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.ss.usermodel.Drawing;
import org.apache.poi.ss.usermodel.Picture;
import org.apache.poi.ss.usermodel.Row;
import java.net.URL;
import java.time.Duration;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

        private final EvidenciaService evidenciaService;

        public DashboardController(EvidenciaService evidenciaService,
                        OrdenServicioService ordenServicioService) {
                this.evidenciaService = evidenciaService;
        }

        // ---------------------------------------------------------------------
        // 1. FILTRO PRINCIPAL DEL DASHBOARD
        // ---------------------------------------------------------------------
        @GetMapping("/filtros")
        public Map<String, Object> getDashboardFiltrado(
                        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaInicio,
                        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaFin,
                        @RequestParam(required = false) Integer clienteId,
                        @RequestParam(required = false) Integer servicioId,
                        @RequestParam(required = false) Estado estado,
                        @RequestParam(required = false) String empleadoId) {

                List<Evidencia> evidencias = evidenciaService.filtrarDashboard(
                                fechaInicio, fechaFin, clienteId, servicioId, estado, empleadoId);

                // ---------------------------------------------------------------------
                // FILTROS EXTRA (SEGURIDAD por si JPA retorna de más)
                // ---------------------------------------------------------------------
                if (fechaInicio != null)
                        evidencias = evidencias.stream()
                                        .filter(e -> !e.getHoraInicio().isBefore(fechaInicio))
                                        .collect(Collectors.toList());

                if (fechaFin != null)
                        evidencias = evidencias.stream()
                                        .filter(e -> !e.getHoraFin().isAfter(fechaFin))
                                        .collect(Collectors.toList());

                if (clienteId != null)
                        evidencias = evidencias.stream()
                                        .filter(e -> e.getOrdenServicio().getOrden().getCliente().getId() == clienteId)
                                        .collect(Collectors.toList());

                if (servicioId != null)
                        evidencias = evidencias.stream()
                                        .filter(e -> e.getOrdenServicio().getServicio().getId() == servicioId)
                                        .collect(Collectors.toList());

                if (estado != null)
                        evidencias = evidencias.stream()
                                        .filter(e -> e.getOrdenServicio().getEstado() == estado)
                                        .collect(Collectors.toList());

                if (empleadoId != null)
                        evidencias = evidencias.stream()
                                        .filter(e -> e.getRegistradaPor() != null &&
                                                        e.getRegistradaPor().getCedula() == empleadoId)
                                        .collect(Collectors.toList());

                // ---------------------------------------------------------------------
                // ESTADÍSTICAS
                // ---------------------------------------------------------------------

                Map<String, Object> respuesta = new HashMap<>();

                respuesta.put("totalEvidencias", evidencias.size());

                long totalHoras = evidencias.stream()
                                .mapToLong(e -> Duration.between(e.getHoraInicio(), e.getHoraFin()).toHours())
                                .sum();
                respuesta.put("totalHoras", totalHoras);

                // Contar por servicio
                Map<String, Long> evidenciasPorServicio = evidencias.stream()
                                .collect(Collectors.groupingBy(
                                                e -> e.getOrdenServicio().getServicio().getNombreServicio(),
                                                Collectors.counting()));
                respuesta.put("evidenciasPorServicio", evidenciasPorServicio);

                // Contar por empleado
                Map<String, Long> evidenciasPorEmpleado = evidencias.stream()
                                .collect(Collectors.groupingBy(
                                                e -> {
                                                        Empleado emp = e.getRegistradaPor();
                                                        return emp != null ? emp.getNombre() : "Sin registrar";
                                                },
                                                Collectors.counting()));
                respuesta.put("evidenciasPorEmpleado", evidenciasPorEmpleado);

                // Contar por estado
                Map<String, Long> evidenciasPorEstado = evidencias.stream()
                                .collect(Collectors.groupingBy(
                                                e -> e.getOrdenServicio().getEstado().name(),
                                                Collectors.counting()));
                respuesta.put("evidenciasPorEstado", evidenciasPorEstado);

                // ---------------------------------------------------------------------
                // LISTA DETALLADA DE EVIDENCIAS PARA EL DASHBOARD
                // ---------------------------------------------------------------------
                List<Map<String, Object>> detalles = evidencias.stream()
                                .map(e -> {
                                        Map<String, Object> info = new HashMap<>();
                                        info.put("idEvidencia", e.getIdEvidencia());
                                        info.put("descripcion", e.getDescripcion());
                                        info.put("rutaArchivo", e.getRutaArchivo());
                                        info.put("tipoArchivo", e.getTipoArchivo());
                                        info.put("horaInicio", e.getHoraInicio());
                                        info.put("horaFin", e.getHoraFin());
                                        info.put("fechaRegistro", e.getFechaRegistro());

                                        // Servicio
                                        info.put("servicio", e.getOrdenServicio().getServicio().getNombreServicio());

                                        // Cliente
                                        info.put("cliente", e.getOrdenServicio().getOrden().getCliente().getNombre());

                                        // Estado
                                        info.put("estado", e.getOrdenServicio().getEstado().name());

                                        // Empleado
                                        Empleado emp = e.getRegistradaPor();
                                        info.put("empleado", emp != null ? emp.getNombre() : "Sin registrar");

                                        return info;
                                })
                                .toList();

                respuesta.put("detalles", detalles);

                return respuesta;
        }

        // ---------------------------------------------------------------------
        // 2. EXPORTAR PDF
        // ---------------------------------------------------------------------
@GetMapping("/export/pdf")
public void exportarPdf(
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaInicio,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaFin,
        @RequestParam(required = false) Integer clienteId,
        @RequestParam(required = false) Integer servicioId,
        @RequestParam(required = false) Estado estado,
        @RequestParam(required = false) String empleadoId,
        HttpServletResponse response
) throws Exception {

    List<Evidencia> evidencias = evidenciaService.filtrarDashboard(
            fechaInicio, fechaFin, clienteId, servicioId, estado, empleadoId
    );

    try (PDDocument document = new PDDocument()) {

        PDPage page = new PDPage();
        document.addPage(page);

        PDPageContentStream content = new PDPageContentStream(document, page);

        // Título
        content.beginText();
        content.setFont(PDType1Font.HELVETICA_BOLD, 18);
        content.newLineAtOffset(50, 750);
        content.showText("REPORTE PDF - DASHBOARD");
        content.endText();

        // Filtros aplicados
        content.beginText();
        content.setFont(PDType1Font.HELVETICA, 12);
        content.newLineAtOffset(50, 720);
        content.showText("Filtros aplicados:");
        content.endText();

        int y = 700;

        String f1 = "Fecha Inicio: " + (fechaInicio != null ? fechaInicio.toString() : "Sin filtro");
        String f2 = "Fecha Fin: " + (fechaFin != null ? fechaFin.toString() : "Sin filtro");
        String f3 = "Cliente ID: " + (clienteId != null ? clienteId : "Sin filtro");
        String f4 = "Servicio ID: " + (servicioId != null ? servicioId : "Sin filtro");
        String f5 = "Estado: " + (estado != null ? estado.name() : "Sin filtro");
        String f6 = "Empleado ID: " + (empleadoId != null ? empleadoId : "Sin filtro");

        List<String> filtros = List.of(f1, f2, f3, f4, f5, f6);

        content.setFont(PDType1Font.HELVETICA, 11);
        for (String linea : filtros) {
            content.beginText();
            content.newLineAtOffset(50, y);
            content.showText(linea);
            content.endText();
            y -= 20;
        }

        // Línea separadora
        y -= 10;
        content.moveTo(40, y);
        content.lineTo(550, y);
        content.stroke();
        y -= 30;

        // Encabezado de tabla
        content.beginText();
        content.setFont(PDType1Font.HELVETICA_BOLD, 13);
        content.newLineAtOffset(50, y);
        content.showText("Listado de Evidencias Encontradas:");
        content.endText();
        y -= 20;

        // Contenido de tabla con saltos de línea
        content.setFont(PDType1Font.HELVETICA, 10);
        for (Evidencia e : evidencias) {
            
            // Verificar si necesita nueva página
            if (y < 100) {
                content.close();
                page = new PDPage();
                document.addPage(page);
                content = new PDPageContentStream(document, page);
                y = 750;
            }

            // Línea 1: ID y Servicio
            String linea1 = "ID Evidencia: " + e.getIdEvidencia() +
                    " | Servicio: " + e.getOrdenServicio().getServicio().getNombreServicio();

            content.beginText();
            content.newLineAtOffset(50, y);
            content.showText(linea1);
            content.endText();
            y -= 15;

            // Línea 2: Cliente y Estado
            String linea2 = "Cliente: " + e.getOrdenServicio().getOrden().getCliente().getNombre() +
                    " | Estado: " + e.getOrdenServicio().getEstado().name();

            content.beginText();
            content.newLineAtOffset(50, y);
            content.showText(linea2);
            content.endText();
            y -= 15;

            // Línea 3: Horas
            String linea3 = "Inicio: " + e.getHoraInicio() + " | Fin: " + e.getHoraFin();

            content.beginText();
            content.newLineAtOffset(50, y);
            content.showText(linea3);
            content.endText();
            y -= 15;

            // Línea 4: Empleado
            String linea4 = "Empleado: " + (e.getRegistradaPor() != null ? e.getRegistradaPor().getNombre() : "Sin registrar");

            content.beginText();
            content.newLineAtOffset(50, y);
            content.showText(linea4);
            content.endText();
            y -= 20;
        }

        content.close();

        // Configurar respuesta HTTP
        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=reporte.pdf");

        document.save(response.getOutputStream());
    }
}


        // ---------------------------------------------------------------------
        // 3. EXPORTAR EXCEL
        // ---------------------------------------------------------------------
@GetMapping("/export/excel")
public void exportarExcel(
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaInicio,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaFin,
        @RequestParam(required = false) Integer clienteId,
        @RequestParam(required = false) Integer servicioId,
        @RequestParam(required = false) Estado estado,
        @RequestParam(required = false) String empleadoId,
        HttpServletResponse response
) throws Exception {

    List<Evidencia> evidencias = evidenciaService.filtrarDashboard(
            fechaInicio, fechaFin, clienteId, servicioId, estado, empleadoId
    );

    Workbook workbook = new XSSFWorkbook();
    Sheet sheet = workbook.createSheet("Reporte Dashboard");

    // ENCABEZADOS
    Row header = sheet.createRow(0);
    header.createCell(0).setCellValue("ID Evidencia");
    header.createCell(1).setCellValue("Descripción");
    header.createCell(2).setCellValue("Hora Inicio");
    header.createCell(3).setCellValue("Hora Fin");
    header.createCell(4).setCellValue("Servicio");
    header.createCell(5).setCellValue("Cliente");
    header.createCell(6).setCellValue("Estado");
    header.createCell(7).setCellValue("Empleado");
    header.createCell(8).setCellValue("Imagen");

    int rowIndex = 1;

    for (Evidencia e : evidencias) {

        Row row = sheet.createRow(rowIndex);
        row.createCell(0).setCellValue(e.getIdEvidencia());
        row.createCell(1).setCellValue(e.getDescripcion());
        row.createCell(2).setCellValue(String.valueOf(e.getHoraInicio()));
        row.createCell(3).setCellValue(String.valueOf(e.getHoraFin()));
        row.createCell(4).setCellValue(e.getOrdenServicio().getServicio().getNombreServicio());
        row.createCell(5).setCellValue(e.getOrdenServicio().getOrden().getCliente().getNombre());
        row.createCell(6).setCellValue(e.getOrdenServicio().getEstado().name());
        row.createCell(7).setCellValue(e.getRegistradaPor() != null ? e.getRegistradaPor().getNombre() : "Sin registrar");

        // Insertar imagen al final (columna 8)
        if (e.getRutaArchivo() != null) {
            try (InputStream is = new URL(e.getRutaArchivo()).openStream()) {

                byte[] bytes = is.readAllBytes();
                int imgId = workbook.addPicture(bytes, Workbook.PICTURE_TYPE_PNG);

                CreationHelper helper = workbook.getCreationHelper();
                Drawing<?> drawing = sheet.createDrawingPatriarch();
                ClientAnchor anchor = helper.createClientAnchor();

                anchor.setCol1(8);  // columna imagen (última)
                anchor.setRow1(rowIndex);

                Picture pict = drawing.createPicture(anchor, imgId);

                // Ajustar tamaño de imagen 30%
                pict.resize(0.30);

                // Ajustar alto de fila y ancho columna imagen
                row.setHeightInPoints(60);
                sheet.setColumnWidth(8, 25 * 256);

            } catch (Exception ex) {
                System.out.println("No se pudo insertar imagen: " + ex.getMessage());
            }
        }

        rowIndex++;
    }

    // Auto-ajustar columnas (menos la de imagen)
    for (int i = 0; i < 8; i++) {
        sheet.autoSizeColumn(i);
    }

    // Preparar descarga
    response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    response.setHeader("Content-Disposition", "attachment; filename=reporte.xlsx");

    workbook.write(response.getOutputStream());
    workbook.close();
}

}
