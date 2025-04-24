package com.example.frontservice.dto.auth;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Builder
@Setter
public class LogoutResponseDTO {
    private boolean successed;
}
