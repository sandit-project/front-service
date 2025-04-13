package com.example.frontservice.controller;

import com.example.frontservice.dto.oauth.OAuthLoginResponseDTO;
import com.example.frontservice.service.OAuthService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/oauth")
public class OAuthApiController {
    private final OAuthService oAuthService;

    @GetMapping("/naver/callback")
    public OAuthLoginResponseDTO naverCallback(
            @RequestParam("code") String code,
            @RequestParam("state") String state,
            HttpServletResponse response
    ) throws IOException {
        // 'code'는 네이버에서 받은 인증 코드입니다.
        System.out.println("naverCallback " + code + " " + state);

        OAuthLoginResponseDTO responseDTO = oAuthService.getAccessToken("naver",code, state, response);

        System.out.println("result is :: " + responseDTO.isLoggedIn() + " " + responseDTO.getMessage());

        if(responseDTO.isLoggedIn()==false){
            response.sendRedirect("http://localhost:9000/oauth/token/" + responseDTO.getMessage() + "/" + responseDTO.getType().name());
        }else{
            response.sendRedirect("http://localhost:9000/oauth/token");
        }

        return responseDTO;
    }

    @GetMapping("/kakao/callback")
    public OAuthLoginResponseDTO kakaoCallback(
            @RequestParam("code") String code,
            @RequestParam("state") String state,
            HttpServletResponse response
    ) throws IOException {
        System.out.println("kakaoCallback " + code + " " + state);

        OAuthLoginResponseDTO responseDTO = oAuthService.getAccessToken("kakao",code, state, response);

        System.out.println("result is :: " + responseDTO.isLoggedIn() + " " + responseDTO.getMessage());

        if(responseDTO.isLoggedIn()==false || responseDTO == null){
            response.sendRedirect("http://localhost:9000/oauth/token/" + responseDTO.getMessage() + "/" + responseDTO.getType().name());
        }else{
            response.sendRedirect("http://localhost:9000/oauth/token");
        }

        return responseDTO;
    }

    @GetMapping("/google/callback")
    public OAuthLoginResponseDTO googleCallback(
            @RequestParam("code") String code,
            HttpServletResponse response
    ) throws IOException {
        System.out.println("googleCallback " + code );

        OAuthLoginResponseDTO responseDTO = oAuthService.getAccessToken("google",code, "", response);

        System.out.println("result is :: " + responseDTO.isLoggedIn() + " " + responseDTO.getMessage());

        if(responseDTO.isLoggedIn()==false || responseDTO == null){
            response.sendRedirect("http://localhost:9000/oauth/token/" + responseDTO.getMessage() + "/" + responseDTO.getType().name());
        }else{
            response.sendRedirect("http://localhost:9000/oauth/token");
        }

        return responseDTO;
    }
}
