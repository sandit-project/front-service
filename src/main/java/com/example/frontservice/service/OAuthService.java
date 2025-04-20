package com.example.frontservice.service;


import com.example.frontservice.client.edge.AuthClient;
import com.example.frontservice.client.social.*;
import com.example.frontservice.dto.oauth.*;
import com.example.frontservice.util.CookieUtil;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import static com.example.frontservice.type.Type.*;

@Service
@RequiredArgsConstructor
public class OAuthService {
    private final NaverTokenClient naverTokenClient;
    private final NaverProfileClient naverProfileClient;

    private final KakaoTokenClient kakaoTokenClient;
    private final GoogleTokenClient googleTokenClient;
    private final KakaoProfileClient kakaoProfileClient;
    private final GoogleProfileClient googleProfileClient;

    private final KakaoRevokeClient kakaoRevokeClient;
    private final GoogleRevokeClient googleRevokeClient;

    private final AuthClient authClient;

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

    public OAuthLoginResponseDTO getAccessToken(String type, String code, String state, HttpServletResponse response) {
        if(type.equals("naver")){
            NaverTokenResponseDTO responseDTO = naverTokenClient.getAccessToken("authorization_code", naverClientId, naverClientSecret, code, state);

            NaverUserInfoResponseDTO resultInfo = getNaverUserInfo(responseDTO.getAccess_token());

            System.out.println(resultInfo.getId() + " " + resultInfo.getNickname() + " " + resultInfo.getMobile());

            // 토큰이랑 사용자 정보 받아와서 edge - auth로 전달 해야함
            OAuthLoginResponseDTO resultDTO = authClient.socialLogin(
                    OAuthLoginRequestDTO.builder()
                            .accessToken(type + ":" + resultInfo.getId() + ":" + responseDTO.getAccess_token())
                            .refreshToken(type + ":" + resultInfo.getId() + ":" + responseDTO.getRefresh_token())
                            .id(resultInfo.getId())
                            .name(resultInfo.getName())
                            .nickname(resultInfo.getNickname())
                            .email("")
                            .mobile(resultInfo.getMobile())
                            .build()
            );

            if(resultDTO.isLoggedIn()){
                CookieUtil.addCookie(response, "refreshToken",type + ":" + resultInfo.getId() + ":" + responseDTO.getRefresh_token(), 7*24*60*60 );
                CookieUtil.addCookie(response, "accessToken",type + ":" + resultInfo.getId() + ":" + responseDTO.getAccess_token(), 60*60 );
            }

            return resultDTO;
        }else if(type.equals("kakao")){
            String contentType = "application/x-www-form-urlencoded;charset=utf-8";
            KakaoTokenResponseDTO responseDTO = kakaoTokenClient.getTokens(contentType,"authorization_code",kakaoClientId,kakaoRedirectUri,code);

            KakaoUserInfoResponseDTO resultInfo = getKakaoUserInfo(responseDTO.getAccess_token());

            System.out.println(resultInfo.getId() + " " + resultInfo.getNickname());

            // 토큰이랑 사용자 정보 받아와서 edge - auth로 전달 해야함
            OAuthLoginResponseDTO resultDTO = authClient.socialLogin(
                    OAuthLoginRequestDTO.builder()
                            .accessToken(type + ":" + resultInfo.getId() + ":" + responseDTO.getAccess_token())
                            .refreshToken(type + ":" + resultInfo.getId() + ":" + responseDTO.getRefresh_token())
                            .id(resultInfo.getId())
                            .name("")
                            .nickname(resultInfo.getNickname())
                            .email("")
                            .mobile("")
                            .build()
            );

            if(resultDTO.isLoggedIn()){
                CookieUtil.addCookie(response, "refreshToken",type + ":" + resultInfo.getId() + ":" + responseDTO.getRefresh_token(), 7*24*60*60 );
                CookieUtil.addCookie(response, "accessToken",type + ":" + resultInfo.getId() + ":" + responseDTO.getAccess_token(), 60*60 );
            }

            return resultDTO;
        }else if (type.equals("google")) {
            GoogleTokenResponseDTO responseDTO = googleTokenClient.getTokens(code,googleClientId,googleClientSecret,googleRedirectUri,"authorization_code");

            GoogleUserInfoResponseDTO resultInfo = getGoogleUserInfo(responseDTO.getAccess_token());

            System.out.println(resultInfo.getSub() + " " + resultInfo.getName() + " " + resultInfo.getEmail());

            // 토큰이랑 사용자 정보 받아와서 edge - auth로 전달 해야함
            OAuthLoginResponseDTO resultDTO = authClient.socialLogin(
                    OAuthLoginRequestDTO.builder()
                            .accessToken(type + ":" + resultInfo.getSub() + ":" + responseDTO.getAccess_token())
                            .refreshToken(type + ":" + resultInfo.getSub() + ":" + responseDTO.getRefresh_token())
                            .id(resultInfo.getSub())
                            .name(resultInfo.getName())
                            .nickname("")
                            .email(resultInfo.getEmail())
                            .mobile("")
                            .build()
            );

            if(resultDTO.isLoggedIn()){
                CookieUtil.addCookie(response, "refreshToken",type + ":" + resultInfo.getSub() + ":" + responseDTO.getRefresh_token(), 7*24*60*60 );
                CookieUtil.addCookie(response, "accessToken",type + ":" + resultInfo.getSub() + ":" + responseDTO.getAccess_token(), 60*60 );
            }

            return resultDTO;
        }else{
            return null;
        }
    }

    public OAuthLoginResponseDTO getReAccessToken(String type, String userId, String refreshToken) {

        if(type.equals("naver")){
            return naverReAccessToken(userId, refreshToken);
        }else if(type.equals("kakao")){
            return kakaoReAccessToken(userId, refreshToken);
        }else if(type.equals("google")){
            return googleReAccessToken(userId, refreshToken);
        }
        NaverTokenResponseDTO responseDTO = naverTokenClient.getReAccessToken("refresh_token", naverClientId, naverClientSecret, refreshToken );

        return OAuthLoginResponseDTO.builder()
                .loggedIn(true)
                .accessToken(type + ":" + responseDTO.getAccess_token())
                .refreshToken(type + ":" + responseDTO.getRefresh_token())
                .build();
    }

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
                    .mobile(jsonNode.get("response").get("mobile").asText())
                    .build();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
    public KakaoUserInfoResponseDTO getKakaoUserInfo(String token) {
        try {
            System.out.println("getKakaoUserInfo in token :: "+token);
            String result = kakaoProfileClient.getKakaoProfile("Bearer " + token);

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(result);

            return KakaoUserInfoResponseDTO.builder()
                    .id(jsonNode.get("id").asText())
                    .nickname(jsonNode.get("properties").get("nickname").asText())
                    .build();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
    public GoogleUserInfoResponseDTO getGoogleUserInfo(String token) {
        try {
            System.out.println("getGoogleUserInfo in token :: "+token);
            String result = googleProfileClient.getGoogleProfile("Bearer " + token);

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(result);

            return GoogleUserInfoResponseDTO.builder()
                    .sub(jsonNode.get("sub").asText())
                    .name(jsonNode.get("name").asText())
                    .email(jsonNode.get("email").asText())
                    .build();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public boolean deleteOAuth(String token){
        String[] splitArr = token.split(":");

        boolean result=false;

        if("naver".equals(splitArr[0])){
            result = "success".equals(naverTokenClient.deleteNaver("delete",naverClientId,naverClientSecret,splitArr[2]).getResult());
        }else if("kakao".equals(splitArr[0])){
            result = kakaoRevokeClient.logout("Bearer " + splitArr[2]) != null;
        }else if("google".equals(splitArr[0])){
            googleRevokeClient.revokeToken(splitArr[2]);
            result = true;
        }

        return result;
    }

    private OAuthLoginResponseDTO naverReAccessToken(String userId, String refreshToken){
        NaverTokenResponseDTO responseDTO = naverTokenClient.getReAccessToken("refresh_token", naverClientId, naverClientSecret, refreshToken );
        if(responseDTO != null){
            return OAuthLoginResponseDTO.builder()
                    .loggedIn(true)
                    .type(NAVER)
                    .accessToken("naver:" + userId + ":" + responseDTO.getAccess_token())
                    .refreshToken("naver:" + userId + ":" + responseDTO.getRefresh_token())
                    .build();
        }else{
            return OAuthLoginResponseDTO.builder()
                    .loggedIn(false)
                    .type(NAVER)
                    .message("Failed to get access token")
                    .build();
        }
    }
    private OAuthLoginResponseDTO kakaoReAccessToken(String userId, String refreshToken){
        String contentType = "application/x-www-form-urlencoded;charset=utf-8";
        KakaoTokenResponseDTO responseDTO = kakaoTokenClient.getReAccessToken(contentType, "refresh_token", kakaoClientId, refreshToken );
        if(responseDTO != null){
            return OAuthLoginResponseDTO.builder()
                    .loggedIn(true)
                    .type(KAKAO)
                    .accessToken("kakao:" + userId + ":" + responseDTO.getAccess_token())
                    .refreshToken("kakao:" + userId + ":" + responseDTO.getRefresh_token())
                    .build();
        }else{
            return OAuthLoginResponseDTO.builder()
                    .loggedIn(false)
                    .type(KAKAO)
                    .message("Failed to get access token")
                    .build();
        }
    }
    private OAuthLoginResponseDTO googleReAccessToken(String userId, String refreshToken){
        GoogleTokenResponseDTO responseDTO = googleTokenClient.getReAccessToken(googleClientId,googleClientSecret,refreshToken,"refresh_token");
        if(responseDTO != null){
            return OAuthLoginResponseDTO.builder()
                    .loggedIn(true)
                    .type(GOOGLE)
                    .accessToken("google:" + userId + ":" + responseDTO.getAccess_token())
                    .refreshToken("google:" + userId + ":" + responseDTO.getRefresh_token())
                    .build();
        }else{
            return OAuthLoginResponseDTO.builder()
                    .loggedIn(false)
                    .type(GOOGLE)
                    .message("Failed to get access token")
                    .build();
        }
    }
}
