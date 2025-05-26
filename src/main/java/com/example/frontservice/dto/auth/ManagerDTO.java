package com.example.frontservice.dto.auth;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ManagerDTO {
    private Long userUid;
    private String userId;
    private String userName;
}
