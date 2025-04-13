package com.example.frontservice.controller;

import ch.qos.logback.core.model.Model;
import com.example.frontservice.dto.*;
import com.example.frontservice.dto.oauth.GoogleUserInfoResponseDTO;
import com.example.frontservice.dto.oauth.KakaoUserInfoResponseDTO;
import com.example.frontservice.dto.oauth.NaverUserInfoResponseDTO;
import com.example.frontservice.service.AuthService;
import com.example.frontservice.service.OAuthService;
import com.example.frontservice.util.CookieUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

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
    public void logout(HttpServletRequest request, HttpServletResponse response) {
        CookieUtil.deleteCookie(request,response,"refreshToken");
        // feign으로 로그아웃요청 보내서 redis 및 DB에 토큰 제거
    }

    @GetMapping("/user/info")
    public UserInfoResponseDTO getUserInfo(HttpServletRequest request) {
        System.out.println("header is :: " + request.getHeader("Authorization").substring(7));
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
