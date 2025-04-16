package com.example.frontservice.client.social;

import com.example.frontservice.dto.oauth.KakaoTokenResponseDTO;
import com.example.frontservice.dto.oauth.NaverTokenResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name="kakaoTokenClient", url="https://kauth.kakao.com/oauth/token")
public interface KakaoTokenClient {
    @PostMapping
    KakaoTokenResponseDTO getTokens(
            @RequestHeader("Content-Type") String contentType,
            @RequestParam("grant_type") String grantType,
            @RequestParam("client_id") String clientId,
            @RequestParam("redirect_uri") String redirectUri,
            @RequestParam("code") String code
    );
    @PostMapping
    KakaoTokenResponseDTO getReAccessToken(
            @RequestHeader("Content-Type") String contentType,
            @RequestParam("grant_type") String grantType,
            @RequestParam("client_id") String clientId,
            @RequestParam("refresh_token") String refresh_token
    );
}
