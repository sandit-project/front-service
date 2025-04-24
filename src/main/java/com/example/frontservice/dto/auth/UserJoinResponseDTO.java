package com.example.frontservice.dto.auth;


import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserJoinResponseDTO {
    private boolean isSuccess;
}
