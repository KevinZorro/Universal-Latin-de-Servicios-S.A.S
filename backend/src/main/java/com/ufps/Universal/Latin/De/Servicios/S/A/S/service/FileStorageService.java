package com.ufps.Universal.Latin.De.Servicios.S.A.S.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {

    // Cambia esto a la ruta que prefieras. 
    // "uploads" se creará en el directorio raíz de tu proyecto.
    private final Path rootLocation = Paths.get("uploads");

    public FileStorageService() {
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("No se pudo inicializar el almacenamiento de archivos", e);
        }
    }

    /**
     * Guarda el archivo y devuelve el nombre único generado.
     */
    public String store(MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("No se puede guardar un archivo vacío.");
        }

        try {
            // Generar un nombre de archivo único para evitar colisiones
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String uniqueFilename = UUID.randomUUID().toString() + extension;

            Path destinationFile = this.rootLocation.resolve(Paths.get(uniqueFilename))
                                      .normalize().toAbsolutePath();

            Files.copy(file.getInputStream(), destinationFile);
            
            // Devuelve el nombre del archivo para guardarlo en la BD
            return uniqueFilename; 
        } catch (IOException e) {
            throw new RuntimeException("Falló al guardar el archivo.", e);
        }
    }

    // Opcional: un método para servir los archivos
    // (Necesitarás un endpoint en un controlador para llamar a esto)
    public File loadFile(String filename) {
        return rootLocation.resolve(filename).toFile();
    }
}