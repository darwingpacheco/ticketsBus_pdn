package com.example.demo.controllers;

import com.example.demo.data.User;
import com.example.demo.services.UserService;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class controllers {
    @Autowired
    private UserService userService;
    private static final Logger logger = LoggerFactory.getLogger(controllers.class);

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            if (user.getEmail() == null && userService.findByEmail(user.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body("El email ya está registrado o es invalido");
            }
            User savedUser = userService.registerUser(user);
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al registrar usuario: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        Optional<User> existingUser = userService.findByEmail(user.getEmail());

        if (existingUser.isPresent() && new BCryptPasswordEncoder().matches(user.getPassword(), existingUser.get().getPassword())) {
            return ResponseEntity.ok(existingUser.get());
        } else {
            return ResponseEntity.badRequest().body("Credenciales incorrectas");
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
}
