package com.example.frontservice.dto.auth;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RefreshTokenRequestDTO {
    private String refreshToken;
}
