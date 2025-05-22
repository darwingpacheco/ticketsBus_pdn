package com.example.demo.services;

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

                    // ✅ providerData devuelve UserRecord.UserInfo[]
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


    public List<Map<String, Object>> getAllFirebaseUsers() {
        List<Map<String, Object>> userList = new ArrayList<>();

        try {
            ListUsersPage page = FirebaseAuth.getInstance().listUsers(null);
            Firestore db = FirestoreClient.getFirestore();

            while (page != null) {
                for (ExportedUserRecord user : page.getValues()) {

                    UserInfo[] providerDataArray = user.getProviderData();
                    List<UserInfo> providers = Arrays.asList(providerDataArray);
                    String provider = providers.isEmpty() ? "unknown" : providers.get(0).getProviderId();

                    // Leer datos de Firestore por UID
                    DocumentSnapshot userDoc = db.collection("users").document(user.getUid()).get().get();

                    Map<String, Object> userData = new HashMap<>();
                    userData.put("uid", user.getUid());
                    userData.put("email", user.getEmail());
                    userData.put("provider", provider);

                    // Agrega los campos personalizados si existen
                    userData.put("document", userDoc.contains("document") ? userDoc.getString("document") : null);
                    userData.put("name", userDoc.contains("name") ? userDoc.getString("name") : null);
                    userData.put("last_name", userDoc.contains("last_name") ? userDoc.getString("last_name") : null);
                    userData.put("phone", userDoc.contains("phone") ? userDoc.getString("phone") : null);

                    userList.add(userData);
                }
                page = page.getNextPage();
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return userList;
    }

}

