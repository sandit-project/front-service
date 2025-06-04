package com.example.frontservice.service;

import com.example.frontservice.client.edge.AuthClient;
import com.example.frontservice.dto.auth.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthClient authClient;

    public boolean existsByUserId(String userId) {
        Map<String, Boolean> res = authClient.checkUserId(userId);
        return Boolean.TRUE.equals(res.get("exists"));
    }

    public UserJoinResponseDTO join(UserJoinRequestDTO userJoinRequestDTO) {
        return authClient.join(userJoinRequestDTO);
    }

    public UserLoginResponseDTO login(UserLoginRequestDTO userLoginRequestDTO) {
        return authClient.login(userLoginRequestDTO);
    }

    public UserInfoResponseDTO getUserInfo(String token) {
        return authClient.getUserInfo("Bearer " + token);
    }

    public LogoutResponseDTO logout(String token) {
        return authClient.logout(token);
    }

    public LogoutResponseDTO deleteAccount(String token) {
        return authClient.deleteAccount(token);
    }

    public ProfileResponseDTO getUserProfile(String token) {
        return authClient.getUserProfile("Bearer " + token);
    }

    public boolean updateProfile(String token, UpdateProfileRequestDTO updateProfileRequestDTO) {
        return authClient.updateProfile(token, updateProfileRequestDTO);
    }
    public List<ManagerResponseDTO> getManagers(String token) {
        return authClient.getManagers(token);
    }

    public UpdateAddressResponseDTO updateAddress(String token, UpdateAddressRequestDTO updateAddressRequestDTO) {
        return authClient.updateUserAddress(token, updateAddressRequestDTO);
    }
}
