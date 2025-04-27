package com.example.frontservice.controller.auth;

import com.example.frontservice.dto.auth.*;
import com.example.frontservice.service.AuthService;
import com.example.frontservice.service.OAuthService;
import com.example.frontservice.util.CookieUtil;
import feign.FeignException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.apache.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class AuthApiController {
    private final AuthService authService;
    private final OAuthService oAuthService;

    @PostMapping("/join")
    public UserJoinResponseDTO join(@RequestBody UserJoinRequestDTO userJoinRequestDTO) {
        return authService.join(userJoinRequestDTO);
    }

    @PostMapping("/login")
    public UserLoginResponseDTO login(
            HttpServletResponse response,
            @RequestBody UserLoginRequestDTO userLoginRequestDTO
    ) {
        UserLoginResponseDTO responseDTO = authService.login(userLoginRequestDTO);

        if(responseDTO != null && responseDTO.isLoggedIn()) {
            CookieUtil.addCookie(response,"refreshToken", responseDTO.getRefreshToken(), 7*24*60*60);
        }

        assert responseDTO != null;

        return responseDTO;
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

        String[] splitArr = token.split(":");

        boolean resultDeleteOAuth=false;
        LogoutResponseDTO resultDTO;

        if("naver".equals(splitArr[0]) || "kakao".equals(splitArr[0]) || "google".equals(splitArr[0])){
            resultDeleteOAuth = oAuthService.deleteOAuth(token);
        }

        if(resultDeleteOAuth || !("naver".equals(splitArr[0]) || "kakao".equals(splitArr[0]) || "google".equals(splitArr[0]))){
            resultDTO = authService.deleteAccount("Bearer " + token);

            if(resultDTO.isSuccessed()){
                CookieUtil.deleteCookie(request,response,"refreshToken");
            }

            return resultDTO;
        }

        return LogoutResponseDTO.builder()
                .successed(false)
                .build();
    }

    @GetMapping("/user/info")
    public UserInfoResponseDTO getUserInfo(HttpServletRequest request, HttpServletResponse response) {
        // auth-service로 요청보내서 가져오는걸로 해야함
        // 바로 소셜로그인 api쓰면 토큰만료상태로 null값 나와서 에러남

        //System.out.println("header is :: " + request.getHeader("Authorization").substring(7));
        String token = request.getHeader("Authorization").substring(7);
        String[] splitArr = token.split(":");
        UserInfoResponseDTO responseDTO = null;
        try{
            responseDTO = authService.getUserInfo(token);
        }catch(FeignException e){
            if (e.status() == 419) {
                response.setStatus(HttpStatus.SC_UNAUTHORIZED);
            } else {
                // 다른 상태코드 처리
                System.out.println("다른 상태코드: " + e.status());
            }
        }
        return responseDTO;
    }

    @GetMapping("/profile")
    public ProfileResponseDTO getUserProfile(HttpServletRequest request, HttpServletResponse response) {
        String token = request.getHeader("Authorization").substring(7);
        ProfileResponseDTO responseDTO = null;
        try{
            responseDTO = authService.getUserProfile(token);
        }catch(FeignException e){
            if (e.status() == 419) {
                response.setStatus(HttpStatus.SC_UNAUTHORIZED);
            } else {
                // 다른 상태코드 처리
                System.out.println("다른 상태코드: " + e.status());
                response.setStatus(HttpStatus.SC_INTERNAL_SERVER_ERROR);
            }
        }
        return responseDTO;
    }

    @PutMapping("/profile")
    public boolean updateProfile(HttpServletRequest request, @RequestBody UpdateProfileRequestDTO updateProfileRequestDTO){
        String token = request.getHeader("Authorization");
        return authService.updateProfile(token, updateProfileRequestDTO);
    }
}
