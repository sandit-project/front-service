package com.example.frontservice.dto.auth;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class EmailRequestDTO {
    private String code;
}
