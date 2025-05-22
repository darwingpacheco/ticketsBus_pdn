package com.example.demo.services;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.auth.ExportedUserRecord;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.ListUsersPage;
import com.google.firebase.auth.UserInfo;
import org.springframework.stereotype.Service;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.firebase.cloud.FirestoreClient;


import java.util.*;

@Service
public class FirebaseUserService {

    public List<Map<String, Object>> getUsersByProvider(String providerFilter) {
        List<Map<String, Object>> userList = new ArrayList<>();

        try {
            ListUsersPage page = FirebaseAuth.getInstance().listUsers(null);
            while (page != null) {
                for (ExportedUserRecord user : page.getValues()) {

                    UserInfo[] providerDataArray = user.getProviderData();
                    List<UserInfo> providers = Arrays.asList(providerDataArray);

                    boolean matches = providers.stream()
                            .anyMatch(p -> p.getProviderId().equalsIgnoreCase(providerFilter + ".com"));

                    if (matches) {
                        Map<String, Object> userData = new HashMap<>();
                        userData.put("uid", user.getUid());
                        userData.put("email", user.getEmail());
                        userData.put("provider", providerFilter + ".com");
                        userList.add(userData);
                    }
                }
                page = page.getNextPage();
            }
        } catch (FirebaseAuthException e) {
            e.printStackTrace();
        }

        return userList;
    }

    public List<Map<String, Object>> getAllFirestoreUsers() {
        List<Map<String, Object>> userList = new ArrayList<>();

        try {
            Firestore db = FirestoreClient.getFirestore();

            // Obtener todos los documentos de la colección "users"
            ApiFuture<QuerySnapshot> future = db.collection("users").get();
            List<QueryDocumentSnapshot> documents = future.get().getDocuments();

            for (QueryDocumentSnapshot doc : documents) {
                Map<String, Object> userData = new HashMap<>();
                userData.put("uid", doc.getId());
                userData.put("email", doc.getString("email"));
                userData.put("document", doc.getString("document"));
                userData.put("name", doc.getString("name"));
                userData.put("last_name", doc.getString("last_name"));
                userData.put("phone", doc.getString("phone"));
                userList.add(userData);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return userList;
    }

}

