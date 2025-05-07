package com.example.frontservice.dto.auth;

import com.example.frontservice.type.Role;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserInfoResponseDTO {
    private Long id;
    private String type;
    private String userName;
    private String userId;
    private Role role;
}
