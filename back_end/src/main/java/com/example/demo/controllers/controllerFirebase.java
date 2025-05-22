package com.example.demo.controllers;

import com.google.api.client.auth.oauth2.TokenRequest;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/tests")
public class controllerFirebase {

    @PostMapping("/google")
    public ResponseEntity<?> authenticateWithGoogle(@RequestBody TokenRequests tokenRequest) {
        try {
            // Verifica el token con Firebase
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(tokenRequest.getToken());

            String uid = decodedToken.getUid(); // Obtiene el UID del usuario en Firebase
            String email = decodedToken.getEmail();

            // Crear una respuesta JSON
            Map<String, String> response = new HashMap<>();
            response.put("message", "Usuario autenticado");
            response.put("email", email);

            // Puedes devolver un token JWT propio o un mensaje personalizado
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Token inválido o expirado.");
            return ResponseEntity.status(401).body(errorResponse);
        }
    }
    
}

// Clase para recibir el token en el request
class TokenRequests {
    private String token;
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
}
