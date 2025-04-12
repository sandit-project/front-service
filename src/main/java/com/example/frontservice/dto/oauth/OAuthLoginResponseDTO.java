package com.example.frontservice.dto.oauth;

import com.example.frontservice.type.Role;
import com.example.frontservice.type.Type;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class OAuthLoginResponseDTO {
    private boolean loggedIn;
    private Type type;
    private String userName;
    private String email;
    private String mobile;
    private Role role;
    private String accessToken;
    private String refreshToken;
    private String message;
}
