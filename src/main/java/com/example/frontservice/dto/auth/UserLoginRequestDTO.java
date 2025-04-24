package com.example.frontservice.dto.auth;

import lombok.Getter;

@Getter
public class UserLoginRequestDTO {
    private String userId;
    private String password;
}
