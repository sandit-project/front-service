package com.example.frontservice.service;

import com.example.frontservice.client.edge.AuthClient;
import com.example.frontservice.dto.RefreshTokenClientResponseDTO;
import com.example.frontservice.dto.RefreshTokenRequestDTO;
import com.example.frontservice.dto.oauth.OAuthUpdateTokensDTO;
import com.example.frontservice.dto.oauth.OAuthLoginResponseDTO;
import com.example.frontservice.util.CookieUtil;
import jakarta.servlet.http.Cookie;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TokenService {

    private final AuthClient authClient;
    private final OAuthService oAuthService;

    public RefreshTokenClientResponseDTO refreshToken(Cookie[] cookies) {
        System.out.println("refresh token request excute!!");
        String refreshToken = CookieUtil.getCookieValue(cookies, "refreshToken");
        if (refreshToken == null) {
            return null;
        }

        // oauth 실패시 토큰 재발행해서 전달하는 로직 추가로 필요함
        RefreshTokenClientResponseDTO resultDTO = authClient.refresh(
                RefreshTokenRequestDTO.builder()
                        .refreshToken(refreshToken)
                        .build());

        String[] splitArr = refreshToken.split(":");

        if(resultDTO.getStatus() == 1){
            if("naver".equals(splitArr[0]) || "kakao".equals(splitArr[0]) || "google".equals(splitArr[0])){
                OAuthLoginResponseDTO responseDTO = oAuthService.getReAccessToken(splitArr[0], splitArr[1], splitArr[2]);

                System.out.println("new accessToken :: " + responseDTO.getAccessToken());
                System.out.println("new refreshToken :: " + responseDTO.getRefreshToken());

                if(responseDTO.isLoggedIn()){
                    // auth-service에 갱신받은 토큰 전달
                    return authClient.updateTokens(
                            OAuthUpdateTokensDTO.builder()
                                    .accessToken(responseDTO.getAccessToken())
                                    .refreshToken(responseDTO.getRefreshToken())
                                    .build()
                    );
                }
            }
        }
        return resultDTO;
    }

}

