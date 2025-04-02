package com.example.frontservice.service;

import com.example.frontservice.client.edge.AuthClient;
import com.example.frontservice.dto.RefreshTokenClientResponseDTO;
import com.example.frontservice.dto.RefreshTokenRequestDTO;
import com.example.frontservice.util.CookieUtil;
import jakarta.servlet.http.Cookie;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TokenService {

    private final AuthClient authClient;

    public RefreshTokenClientResponseDTO refreshToken(Cookie[] cookies) {
        String refreshToken = CookieUtil.getCookieValue(cookies, "refreshToken");
        if (refreshToken == null) {
            return null;
        }

        return authClient.refresh(
                RefreshTokenRequestDTO.builder()
                        .refreshToken(refreshToken)
                        .build()
        );
    }

}

