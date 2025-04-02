package com.example.frontservice.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginClientResponseDTO {
    private boolean loggedIn;
    private String userName;
    private String userId;
    private String accessToken;
    private String refreshToken;

    public LoginResponseDTO toLoginResponseDTO() {
        return LoginResponseDTO.builder()
                .userName(userName)
                .userId(userId)
                .accessToken(accessToken)
                .url(loggedIn? "/webs/home" : "/webs/login")
                .message(loggedIn? "Login Successful" : "Login Failed")
                .build();
    }
}
