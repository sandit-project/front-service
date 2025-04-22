package com.example.frontservice.service;

import com.example.frontservice.client.edge.AuthClient;
import com.example.frontservice.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthClient authClient;

    public JoinClientResponseDTO join(JoinRequestDTO joinRequestDTO) {
        return authClient.join(joinRequestDTO);
    }

    public LoginClientResponseDTO login(LoginRequestDTO loginRequestDTO) {
        return authClient.login(loginRequestDTO);
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

    public String sendEmailCode(String email) {
        return authClient.sendEmailCode(email);
    }

    public String verifyEmailCode(String email, String code) {
        Map<String,String> body = Map.of("email", email, "code", code);
        return authClient.verifyEmailCode(email, body);
    }
}
