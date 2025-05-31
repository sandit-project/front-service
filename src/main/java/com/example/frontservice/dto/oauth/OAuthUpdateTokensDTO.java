package com.example.frontservice.dto.oauth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OAuthUpdateTokensDTO {
    private String accessToken;
    private String refreshToken;
}
