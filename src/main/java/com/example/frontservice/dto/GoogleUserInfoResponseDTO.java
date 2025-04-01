package com.example.frontservice.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GoogleUserInfoResponseDTO {
    private String sub;
    private String name;
    private String email;
}
