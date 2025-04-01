package com.example.frontservice.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class NaverUserInfoResponseDTO {
    private String id;
    private String name;
    private String nickname;
    private String mobile;
}
