package com.example.frontservice.dto.auth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RefreshTokenClientResponseDTO {
    private int status;
    private String accessToken;
    private String refreshToken;

    public RefreshTokenResponseDTO toRefreshTokenResponseDTO() {
        return RefreshTokenResponseDTO.builder()
                .status(status)
                .accessToken(accessToken)
                .build();
    }
}
