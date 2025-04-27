package com.example.frontservice.service;

import com.example.frontservice.client.edge.AuthClient;
import com.example.frontservice.dto.auth.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthClient authClient;

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
}
