package com.example.frontservice.client.edge;

import com.example.frontservice.dto.*;
import com.example.frontservice.dto.oauth.OAuthLoginRequestDTO;
import com.example.frontservice.dto.oauth.OAuthLoginResponseDTO;
import com.example.frontservice.dto.oauth.OAuthUpdateTokensDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

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

    @PostMapping("/re/tokens")
    RefreshTokenClientResponseDTO updateTokens(@RequestBody OAuthUpdateTokensDTO oAuthUpdateTokensDTO);

    @PostMapping("/user/info")
    UserInfoResponseDTO getUserInfo(@RequestHeader("Authorization")String token);

    @PostMapping("/logout")
    LogoutResponseDTO logout(@RequestHeader("Authorization")String token);

    @DeleteMapping("/user")
    LogoutResponseDTO deleteAccount(@RequestHeader("Authorization")String token);

    @GetMapping("/email/{email}/authcode")
    String sendEmailCode(@PathVariable("email") String email);

    @PostMapping("/email/{email}/authcode")
    String verifyEmailCode(@PathVariable("email") String email,
                           @RequestBody Map<String,String> body);

}
