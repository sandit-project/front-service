package com.example.frontservice.controller;

import ch.qos.logback.core.model.Model;
import com.example.frontservice.dto.*;
import com.example.frontservice.dto.oauth.GoogleUserInfoResponseDTO;
import com.example.frontservice.dto.oauth.KakaoLogoutResponseDTO;
import com.example.frontservice.dto.oauth.KakaoUserInfoResponseDTO;
import com.example.frontservice.dto.oauth.NaverUserInfoResponseDTO;
import com.example.frontservice.service.AuthService;
import com.example.frontservice.service.OAuthService;
import com.example.frontservice.util.CookieUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.UnsupportedEncodingException;

import static com.example.frontservice.type.Role.ROLE_USER;

@RestController
@RequiredArgsConstructor
public class AuthApiController {
    private final AuthService authService;
    private final OAuthService oAuthService;

    @PostMapping("/join")
    public JoinResponseDTO join(@RequestBody JoinRequestDTO joinRequestDTO) {
        return authService.join(joinRequestDTO).toJoinResponseDTO();
    }

    @PostMapping("/login")
    public LoginResponseDTO login(
            HttpServletResponse response,
            @RequestBody LoginRequestDTO loginRequestDTO
    ) {
        LoginClientResponseDTO responseDTO = authService.login(loginRequestDTO);

        if(responseDTO != null && responseDTO.isLoggedIn()) {
            CookieUtil.addCookie(response,"refreshToken", responseDTO.getRefreshToken(), 7*24*60*60);
        }

        assert responseDTO != null;

        return responseDTO.toLoginResponseDTO();
    }

    @PostMapping("/logout")
    public LogoutResponseDTO logout(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String token = request.getHeader("Authorization").substring(7);
        
        LogoutResponseDTO resultDTO = authService.logout("Bearer " + token);
        
        if(resultDTO.isSuccessed()){
            CookieUtil.deleteCookie(request,response,"refreshToken");
        }

        return resultDTO;
    }

    @DeleteMapping("/user")
    public LogoutResponseDTO deleteAccount(HttpServletRequest request, HttpServletResponse response){
        String token = request.getHeader("Authorization").substring(7);

        LogoutResponseDTO resultDTO = authService.deleteAccount("Bearer " + token);

        if(resultDTO.isSuccessed()){
            CookieUtil.deleteCookie(request,response,"refreshToken");
        }

        return resultDTO;
    }

    @GetMapping("/user/info")
    public UserInfoResponseDTO getUserInfo(HttpServletRequest request) {
        //System.out.println("header is :: " + request.getHeader("Authorization").substring(7));
        String[] splitArr = request.getHeader("Authorization").substring(7).split(":");
        if("naver".equals(splitArr[0])){
            NaverUserInfoResponseDTO responseDTO = oAuthService.getNaverUserInfo(splitArr[2]);
            return UserInfoResponseDTO.builder()
                    .userId(responseDTO.getId())
                    .userName(responseDTO.getName())
                    .role(ROLE_USER)
                    .build();
        }else if("kakao".equals(splitArr[0])){
            KakaoUserInfoResponseDTO responseDTO = oAuthService.getKakaoUserInfo(splitArr[2]);
            return UserInfoResponseDTO.builder()
                    .userId(responseDTO.getId())
                    .userName(responseDTO.getNickname())
                    .role(ROLE_USER)
                    .build();
        }else if("google".equals(splitArr[0])){
            GoogleUserInfoResponseDTO responseDTO = oAuthService.getGoogleUserInfo(splitArr[2]);
            return UserInfoResponseDTO.builder()
                    .userId(responseDTO.getSub())
                    .userName(responseDTO.getName())
                    .role(ROLE_USER)
                    .build();
        }else{
            return authService.getUserInfo(splitArr[0]);
        }
    }

}
