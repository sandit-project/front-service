package com.example.frontservice.client.social;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name="googleRevokeClient", url="https://oauth2.googleapis.com/revoke")
public interface GoogleRevokeClient {

    @PostMapping(consumes = "application/x-www-form-urlencoded", produces = "application/json")
    void revokeToken(
            @RequestParam("token") String token
    );
}
