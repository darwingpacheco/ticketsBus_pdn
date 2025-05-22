package com.example.demo.controllers;

import com.example.demo.services.FirebaseUserService;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:4200") // o "*", según tus necesidades
@RestController
@RequestMapping("/tests")
public class controllerFirebase {

    private static final Logger logger = LoggerFactory.getLogger(controllerFirebase.class);

    @Autowired
    private FirebaseUserService firebaseUserService;

    @PostMapping("/google")
    public ResponseEntity<?> authenticateWithGoogle(@RequestBody TokenRequests tokenRequest) {
        logger.info(">>> Iniciando autenticación con Google...");
        logger.debug("Token recibido: {}", tokenRequest.getToken());

        try {
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(tokenRequest.getToken());
            String uid = decodedToken.getUid();
            String email = decodedToken.getEmail();

            logger.info(">>> Usuario autenticado. UID: {}, Email: {}", uid, email);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Usuario autenticado");
            response.put("email", email);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error(">>> Error al verificar token de Google: {}", e.getMessage(), e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Token inválido o expirado.");
            return ResponseEntity.status(401).body(errorResponse);
        }
    }

    @PostMapping("/github")
    public ResponseEntity<?> authenticateWithGitHub(@RequestBody TokenRequests tokenRequest) {
        logger.info(">>> Iniciando autenticación con GitHub...");
        logger.debug("Token recibido: {}", tokenRequest.getToken());

        try {
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(tokenRequest.getToken());
            String uid = decodedToken.getUid();
            String email = decodedToken.getEmail();

            logger.info(">>> Usuario autenticado con GitHub. UID: {}, Email: {}", uid, email);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Usuario autenticado con GitHub");
            response.put("email", email);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error(">>> Error al verificar token de GitHub: {}", e.getMessage(), e);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Token inválido o expirado.");
            return ResponseEntity.status(401).body(errorResponse);
        }
    }
  
    @GetMapping("/listUsersProvider/{provider}")
    public ResponseEntity<List<Map<String, Object>>> getUsersByProvider(@PathVariable String provider) {
        logger.info(">>> Endpoint /listUsersProvider/{} invocado", provider);

        try {
            List<Map<String, Object>> filteredUsers = firebaseUserService.getUsersByProvider(provider);
            logger.info(">>> Usuarios obtenidos: {}", filteredUsers);
            return ResponseEntity.ok(filteredUsers);
        } catch (Exception e) {
            logger.error(">>> Error al obtener usuarios por proveedor '{}': {}", provider, e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/allUsers")
    public ResponseEntity<List<Map<String, Object>>> getAllFirebaseUsers() {
        logger.info(">>> Endpoint /listAllUsers invocado");

        try {
            List<Map<String, Object>> allUsers = firebaseUserService.getAllFirebaseUsers();
            logger.info(">>> Usuarios obtenidos: {}", allUsers.size());
            return ResponseEntity.ok(allUsers);
        } catch (Exception e) {
            logger.error(">>> Error al obtener todos los usuarios: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

}

// Clase para recibir el token en el request
class TokenRequests {
    private String token;
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
}
