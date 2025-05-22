package com.example.demo.services;

import com.google.firebase.auth.ExportedUserRecord;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.ListUsersPage;
import com.google.firebase.auth.UserInfo;
import org.springframework.stereotype.Service;

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
}

