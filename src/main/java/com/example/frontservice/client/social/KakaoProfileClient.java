package com.example.frontservice.client.social;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name="kakaoProfileClient", url="https://kapi.kakao.com/v2/user/me")
public interface KakaoProfileClient {
    @GetMapping
    String getKakaoProfile(@RequestHeader("Authorization")String token);
}
