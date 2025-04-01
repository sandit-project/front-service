package com.example.frontservice.service;


import com.example.frontservice.client.social.*;
import com.example.frontservice.dto.*;
import com.example.frontservice.util.CookieUtil;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OAuthService {
    private final NaverTokenClient naverTokenClient;
    private final NaverProfileClient naverProfileClient;

    private final KakaoTokenClient kakaoTokenClient;

    private final GoogleTokenClient googleTokenClient;
    private final KakaoProfileClient kakaoProfileClient;
    private final GoogleProfileClient googleProfileClient;

    @Value("${oauth.naver.client-id}")
    private String naverClientId;

    @Value("${oauth.naver.client-secret}")
    private String naverClientSecret;

    @Value("${oauth.naver.redirect-uri}")
    private String naverRedirectUri;

    @Value("${oauth.kakao.client-id}")
    private String kakaoClientId;

    @Value("${oauth.kakao.redirect-uri}")
    private String kakaoRedirectUri;

    @Value("${oauth.google.client-id}")
    private String googleClientId;

    @Value("${oauth.google.client-secret}")
    private String googleClientSecret;

    @Value("${oauth.google.redirect-uri}")
    private String googleRedirectUri;

    public UserLoginResponseDTO getAccessToken(String type, String code, String state, HttpServletResponse response) {
        if(type.equals("naver")){
            NaverTokenResponseDTO responseDTO = naverTokenClient.getAccessToken("authorization_code", naverClientId, naverClientSecret, code, state);

            CookieUtil.addCookie(response, "refreshToken",type + ":" + responseDTO.getRefresh_token(), 7*24*60*60 );
            CookieUtil.addCookie(response, "accessToken",type + ":" + responseDTO.getAccess_token(), 60*60 );

            NaverUserInfoResponseDTO resultInfo = getNaverUserInfo(responseDTO.getAccess_token());

            System.out.println(resultInfo.getId() + " " + resultInfo.getNickname() + " " + resultInfo.getMobile());

            // 토큰이랑 사용자 정보 받아와서 edge - auth로 전달 해야함

            return UserLoginResponseDTO.builder()
                    .loggedIn(true)
                    .accessToken(type + ":" + responseDTO.getAccess_token())
                    .refreshToken(type + ":" + responseDTO.getRefresh_token())
                    .build();
        }else if(type.equals("kakao")){
            String contentType = "application/x-www-form-urlencoded;charset=utf-8";
            KakaoTokenResponseDTO responseDTO = kakaoTokenClient.getTokens(contentType,"authorization_code",kakaoClientId,kakaoRedirectUri,code);

            CookieUtil.addCookie(response, "refreshToken",type + ":" + responseDTO.getRefresh_token(), 7*24*60*60 );
            CookieUtil.addCookie(response, "accessToken",type + ":" + responseDTO.getAccess_token(), 60*60 );

            String resultInfo = kakaoProfileClient.getKakaoProfile(responseDTO.getAccess_token());
            System.out.println(resultInfo);

            return UserLoginResponseDTO.builder()
                    .loggedIn(true)
                    .accessToken(type + ":" + responseDTO.getAccess_token())
                    .refreshToken(type + ":" + responseDTO.getRefresh_token())
                    .build();
        }else if (type.equals("google")) {
            GoogleTokenResponseDTO responseDTO = googleTokenClient.getTokens(code,googleClientId,googleClientSecret,googleRedirectUri,"authorization_code");

            CookieUtil.addCookie(response, "refreshToken",type + ":" + responseDTO.getRefresh_token(), 7*24*60*60 );
            CookieUtil.addCookie(response, "accessToken",type + ":" + responseDTO.getAccess_token(), 60*60 );

            String resultInfo = googleProfileClient.getGoogleProfile(responseDTO.getAccess_token());
            System.out.println(resultInfo);

            return UserLoginResponseDTO.builder()
                    .loggedIn(true)
                    .accessToken(type + ":" + "testToken")
                    .refreshToken(type + ":" + "testToken")
                    .build();
        }
        return null;
    }

//    public UserLoginResponseDTO getReAccessToken(String type, String refreshToken, HttpServletResponse response) {
//
//        NaverTokenResponseDTO responseDTO = naverTokenClient.getReAccessToken("refresh_token", naverClientId, naverClientSecret, refreshToken );
//
////        CookieUtil.addCookie(response, "refreshToken",type + ":" + responseDTO.getRefresh_token(), 7*24*60*60 );
////        CookieUtil.addCookie(response, "accessToken",type + ":" + responseDTO.getAccess_token(), 60*60 );
//
//        return UserLoginResponseDTO.builder()
//                .loggedIn(true)
//                .accessToken(type + ":" + responseDTO.getAccess_token())
//                .refreshToken(type + ":" + responseDTO.getRefresh_token())
//                .build();
//    }

    public NaverUserInfoResponseDTO getNaverUserInfo(String token) {
        try {
            System.out.println("getNaverUserInfo in token :: "+token);
            String result = naverProfileClient.getNaverProfile("Bearer " + token);

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(result);

            return NaverUserInfoResponseDTO.builder()
                    .id(jsonNode.get("response").get("id").asText())
                    .name(jsonNode.get("response").get("name").asText())
                    .nickname(jsonNode.get("response").get("nickname").asText())
                    .build();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

//    public Authentication getAuthentication(String token, String name) {
//        // Claims에서 역할을 추출하고, GrantedAuthority로 변환
//        List<GrantedAuthority> authorities = Collections.singletonList(
//                // 권한은 리스트로 여러 개 넣어 줄 수도 있다.
//                new SimpleGrantedAuthority(Role.ROLE_USER.name())
//        );
//
//        // UserDetails 객체 생성
//        UserDetails userDetails = new User(name,"",authorities);
//
//        // spring security에 인증객체 생성한거 등록 해줌 (컨버팅)
//        return new UsernamePasswordAuthenticationToken(userDetails, token, authorities);
//    }
}
