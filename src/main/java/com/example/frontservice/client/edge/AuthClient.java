package com.example.frontservice.client.edge;

import com.example.frontservice.dto.auth.*;
import com.example.frontservice.dto.oauth.OAuthLoginRequestDTO;
import com.example.frontservice.dto.oauth.OAuthLoginResponseDTO;
import com.example.frontservice.dto.oauth.OAuthUpdateTokensDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@FeignClient(name = "authClient", url = "${sandit.edge-service-url}/auths")
public interface AuthClient {

    @PostMapping("/join")
    UserJoinResponseDTO join(@RequestBody UserJoinRequestDTO userJoinRequestDTO);

    @PostMapping("/login")
    UserLoginResponseDTO login(@RequestBody UserLoginRequestDTO userLoginRequestDTO);

    @PostMapping("/login/oauth")
    OAuthLoginResponseDTO socialLogin(@RequestBody OAuthLoginRequestDTO oAuthLoginRequestDTO);

    @PostMapping("/refresh")
    RefreshTokenClientResponseDTO refresh(@RequestBody RefreshTokenRequestDTO refreshTokenRequestDTO);

    @PostMapping("/re/tokens")
    RefreshTokenClientResponseDTO updateTokens(@RequestBody OAuthUpdateTokensDTO oAuthUpdateTokensDTO);

    @PostMapping("/user/info")
    UserInfoResponseDTO getUserInfo(@RequestHeader("Authorization")String token);

    @PostMapping("/logout")
    LogoutResponseDTO logout(@RequestHeader("Authorization")String token);

    @DeleteMapping("/user")
    LogoutResponseDTO deleteAccount(@RequestHeader("Authorization")String token);

    @PostMapping("/profile")
    ProfileResponseDTO getUserProfile(@RequestHeader("Authorization")String token);

    @PutMapping("/profile")
    boolean updateProfile(@RequestHeader("Authorization") String token, @RequestBody UpdateProfileRequestDTO updateProfileRequestDTO);

}
