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

import java.util.List;

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

    @GetMapping("/allUsers")
    public List<User> getAllUsers() {
        return userService.findAll();
    }

    @DeleteMapping("/{document}")
    public ResponseEntity<?> deleteUser(@PathVariable String document) {
        userService.deleteById(document);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{document}")
    public ResponseEntity<?> updateUser(@PathVariable String document, @RequestBody User updatedUser) {
        Optional<User> userOptional = userService.findById(document);

        if (userOptional.isPresent()) {
            User existingUser = userOptional.get();
            existingUser.setName(updatedUser.getName());
            existingUser.setLast_name(updatedUser.getLast_name());
            existingUser.setEmail(updatedUser.getEmail());
            // No actualizar la contraseña ni el documento aquí

            userService.save(existingUser);
            return ResponseEntity.ok(existingUser);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
        }
    }

}
