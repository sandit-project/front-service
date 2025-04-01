package com.example.frontservice.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GoogleTokenResponseDTO {
    private String access_token;
    private String token_type;
    private int expires_in;
    private String scope;
    private String refresh_token;
}
