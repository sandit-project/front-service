package com.example.frontservice.controller;

import com.example.frontservice.dto.RefreshTokenClientResponseDTO;
import com.example.frontservice.dto.RefreshTokenResponseDTO;
import com.example.frontservice.dto.UserInfoResponseDTO;
import com.example.frontservice.service.TokenService;
import com.example.frontservice.util.CookieUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@RestController
@RequiredArgsConstructor
public class TokenApiController {

    private final TokenService tokenService;

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ){
        RefreshTokenClientResponseDTO refreshTokenClientResponseDTO = tokenService.refreshToken(request.getCookies());

        if (refreshTokenClientResponseDTO == null || refreshTokenClientResponseDTO.getStatus() != 1) {
            return ResponseEntity.status(UNAUTHORIZED)
                    .body("Refresh token failed");
        }

        CookieUtil.addCookie(response, "refreshToken", refreshTokenClientResponseDTO.getRefreshToken(), 7*24*60*60);

        return ResponseEntity.ok(
                RefreshTokenResponseDTO.builder()
                        .status(refreshTokenClientResponseDTO.getStatus())
                        .accessToken(refreshTokenClientResponseDTO.getAccessToken())
                        .build()
        );
    }

}
