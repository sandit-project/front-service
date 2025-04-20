package com.example.frontservice.client.social;

import com.example.frontservice.dto.oauth.NaverDeleteUserResponseDTO;
import com.example.frontservice.dto.oauth.NaverTokenResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name="naverTokenClient", url="https://nid.naver.com/oauth2.0/token")
public interface NaverTokenClient {
    @GetMapping
    NaverTokenResponseDTO getAccessToken(
            @RequestParam("grant_type") String grantType,
            @RequestParam("client_id") String clientId,
            @RequestParam("client_secret") String clientSecret,
            @RequestParam("code") String code,
            @RequestParam("state") String state
    );
    @GetMapping
    NaverTokenResponseDTO getReAccessToken(
            @RequestParam("grant_type") String grantType,
            @RequestParam("client_id") String clientId,
            @RequestParam("client_secret") String clientSecret,
            @RequestParam("refresh_token") String refreshToken
    );
    @GetMapping
    NaverDeleteUserResponseDTO deleteNaver(
            @RequestParam("grant_type") String grantType,
            @RequestParam("client_id") String clientId,
            @RequestParam("client_secret") String clientSecret,
            @RequestParam("access_token") String accessToken
    );
}
