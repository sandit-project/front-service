package com.example.frontservice.dto.oauth;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class NaverDeleteUserResponseDTO {
    private String access_token;
    private String result;
}
