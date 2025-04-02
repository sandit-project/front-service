package com.example.frontservice.dto.oauth;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class KakaoUserInfoResponseDTO {
    private String id;
    private String nickname;

}
