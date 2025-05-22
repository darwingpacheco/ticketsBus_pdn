package com.example.demo.services;

import com.example.demo.data.User;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

@Service
public class UserService {

    private Firestore getDb() {
        return FirestoreClient.getFirestore();
    }

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public boolean deleteUserByDocumentId(String documentId) {
        try {
            ApiFuture<QuerySnapshot> future = getDb()
                    .collection("users")
                    .whereEqualTo("document", documentId)
                    .get();

            List<QueryDocumentSnapshot> documents = future.get().getDocuments();

            if (!documents.isEmpty()) {
                for (QueryDocumentSnapshot doc : documents) {
                    doc.getReference().delete();
                }
                return true;
            } else {
                return false;
            }
        } catch (Exception e) {
            throw new RuntimeException("Error al eliminar usuario por document", e);
        }
    }

    public Optional<User> findById(String documentId) {
        try {
            DocumentSnapshot snapshot = getDb().collection("users").document(documentId).get().get();
            if (snapshot.exists()) {
                User user = snapshot.toObject(User.class);
                return Optional.ofNullable(user);
            } else {
                return Optional.empty();
            }
        } catch (Exception e) {
            throw new RuntimeException("Error al buscar usuario por ID", e);
        }
    }

    public Optional<User> findByDocumentId(String documentId) {
        try {
            ApiFuture<QuerySnapshot> future = getDb()
                    .collection("users")
                    .whereEqualTo("document", documentId)
                    .get();

            List<QueryDocumentSnapshot> documents = future.get().getDocuments();

            if (!documents.isEmpty()) {
                User user = documents.get(0).toObject(User.class);
                return Optional.ofNullable(user);
            } else {
                return Optional.empty();
            }
        } catch (Exception e) {
            throw new RuntimeException("Error al buscar usuario por documentId", e);
        }
    }

    public void updateUserByDocumentField(String oldDocumentId, User updatedUser) {
        try {
            ApiFuture<QuerySnapshot> future = getDb()
                    .collection("users")
                    .whereEqualTo("document", oldDocumentId)
                    .get();

            List<QueryDocumentSnapshot> documents = future.get().getDocuments();

            if (!documents.isEmpty()) {
                DocumentReference docRef = documents.get(0).getReference();
                docRef.set(updatedUser, SetOptions.merge());
            } else {
                throw new RuntimeException("Usuario con document " + oldDocumentId + " no encontrado.");
            }
        } catch (Exception e) {
            throw new RuntimeException("Error al actualizar usuario", e);
        }
    }

    public void save(User user) {
        try {
            getDb().collection("users")
                    .document(user.getDocument())
                    .set(user)
                    .get();
        } catch (Exception e) {
            throw new RuntimeException("Error al guardar usuario", e);
        }
    }
}
