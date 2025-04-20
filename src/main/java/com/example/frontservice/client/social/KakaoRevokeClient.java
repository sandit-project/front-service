package com.example.frontservice.client.social;

import com.example.frontservice.dto.oauth.KakaoLogoutResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name="KakaoLogoutClient", url="https://kapi.kakao.com/v1/user/unlink")
public interface KakaoRevokeClient {
    @PostMapping
    KakaoLogoutResponseDTO logout(@RequestHeader("Authorization")String token);
}