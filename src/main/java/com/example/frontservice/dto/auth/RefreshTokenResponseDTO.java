package com.example.frontservice.dto.auth;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RefreshTokenResponseDTO {
    private int status;
    private String accessToken;
}
