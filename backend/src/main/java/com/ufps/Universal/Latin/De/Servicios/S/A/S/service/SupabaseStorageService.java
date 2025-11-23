package com.ufps.Universal.Latin.De.Servicios.S.A.S.service;

import java.io.IOException;
import java.util.UUID;

import org.springframework.stereotype.Service;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

@Service
public class SupabaseStorageService {

    private final String SUPABASE_URL = "https://pmscfizoobvvrslqtgxe.supabase.co";
    private final String SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtc2NmaXpvb2J2dnJzbHF0Z3hlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTQzNTQyOSwiZXhwIjoyMDc3MDExNDI5fQ.QNIPtS72WMg4rG0FLWdn18p_ArSASQnRB2PBvL2dx3E";
    private final OkHttpClient client = new OkHttpClient();

    public String uploadImage(byte[] fileBytes, String originalFilename) throws IOException {

        String uniqueName = UUID.randomUUID() + "_" + originalFilename;

        RequestBody requestBody = RequestBody.create(
                fileBytes,
                MediaType.parse("application/octet-stream")
        );

        Request request = new Request.Builder()
                .url(SUPABASE_URL + "/storage/v1/object/imagenes/" + uniqueName)
                .header("apikey", SUPABASE_KEY)
                .header("Authorization", "Bearer " + SUPABASE_KEY)
                .put(requestBody)
                .build();

        try (Response response = client.newCall(request).execute()) {

            if (!response.isSuccessful()) {
                throw new IOException("Error al subir imagen: "
                        + response.code() + " " + response.message()
                        + " -> " + response.body().string());
            }
        }

        return SUPABASE_URL + "/storage/v1/object/public/imagenes/" + uniqueName;
    }

    public String uploadHojaDeVida(byte[] fileBytes, String originalFilename) throws IOException {

    String uniqueName = UUID.randomUUID() + "_" + originalFilename;

    RequestBody requestBody = RequestBody.create(
            fileBytes,
            MediaType.parse("application/octet-stream")
    );

    Request request = new Request.Builder()
            .url(SUPABASE_URL + "/storage/v1/object/hojasvida/" + uniqueName)
            .header("apikey", SUPABASE_KEY)
            .header("Authorization", "Bearer " + SUPABASE_KEY)
            .put(requestBody)
            .build();

    try (Response response = client.newCall(request).execute()) {
        if (!response.isSuccessful()) {
            throw new IOException("Error al subir archivo: "
                    + response.code() + " " + response.message()
                    + " -> " + response.body().string());
        }
    }

    return SUPABASE_URL + "/storage/v1/object/public/hojasvida/" + uniqueName;
}
}