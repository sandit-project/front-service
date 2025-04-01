package com.example.frontservice.client.social;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name="googleProfileClient", url="https://www.googleapis.com/oauth2/v3/userinfo")
public interface GoogleProfileClient {
    @GetMapping
    String getGoogleProfile(@RequestHeader("Authorization")String token);
}
