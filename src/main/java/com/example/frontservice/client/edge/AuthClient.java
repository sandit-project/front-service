package com.example.frontservice.client.edge;

import com.example.frontservice.dto.*;
import com.example.frontservice.dto.oauth.OAuthLoginRequestDTO;
import com.example.frontservice.dto.oauth.OAuthLoginResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "authClient", url = "${sandit.edge-service-url}/auths")
public interface AuthClient {

    @PostMapping("/join")
    JoinClientResponseDTO join(@RequestBody JoinRequestDTO joinRequestDTO);

    @PostMapping("/login")
    LoginClientResponseDTO login(@RequestBody LoginRequestDTO loginRequestDTO);

    @PostMapping("/login/oauth")
    OAuthLoginResponseDTO socialLogin(@RequestBody OAuthLoginRequestDTO oAuthLoginRequestDTO);

    @PostMapping("/refresh")
    RefreshTokenClientResponseDTO refresh(@RequestBody RefreshTokenRequestDTO refreshTokenRequestDTO);

}
