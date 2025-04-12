package com.example.frontservice.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.Arrays;

@Controller
@RequestMapping("/oauth")
public class OAuthController {

    @Value("${oauth.naver.client-id}")
    private String naverClientId;

    @Value("${oauth.naver.redirect-uri}")
    private String naverRedirectUri;

    @Value("${oauth.state}")
    private String state;

    @Value("${oauth.kakao.client-id}")
    private String kakaoClientId;

    @Value("${oauth.kakao.redirect-uri}")
    private String kakaoRedirectUri;

    @Value("${oauth.google.client-id}")
    private String googleClientId;

    @Value("${oauth.google.redirect-uri}")
    private String googleRedirectUri;

    @GetMapping("/naver")
    public String naverLogin() throws UnsupportedEncodingException {

        String authUrl = "https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=" + naverClientId
                + "&redirect_uri=" + naverRedirectUri + "&state=" + URLEncoder.encode(state, "UTF-8");

        return "redirect:" + authUrl;  // 네이버 로그인 페이지로 리디렉션
    }

    @GetMapping("/kakao")
    public String kakaoLogin() throws UnsupportedEncodingException {

        String authUrl = "https://kauth.kakao.com/oauth/authorize?client_id=" + kakaoClientId
                + "&redirect_uri=" + kakaoRedirectUri + "&response_type=code&state=" + URLEncoder.encode(state, "UTF-8");

        return "redirect:" + authUrl;  // 카카오 로그인 페이지로 리디렉션
    }

    @GetMapping("/google")
    public String googleLogin() throws UnsupportedEncodingException {

        String authUrl = "https://accounts.google.com/o/oauth2/v2/auth?client_id=" + googleClientId
                + "&redirect_uri=" + googleRedirectUri + "&scope=email%20profile&response_type=code&access_type=offline";

        return "redirect:" + authUrl;  // 카카오 로그인 페이지로 리디렉션
    }

    @GetMapping("/token")
    public String tokenPage(
            HttpServletRequest request,
            Model model
    ){
        Cookie[] cookies = request.getCookies();

        System.out.println(Arrays.toString(cookies));

        if (cookies == null) {
            return "sign-in";
        }
        for (Cookie cookie : cookies) {
            if ("accessToken".equals(cookie.getName())) {
                model.addAttribute("accessToken", cookie.getValue());
                return "token";
            }
        }
        return "sign-in";
    }

    @GetMapping("/token/{message}/{type}")
    public String tokenFailPage(
            @PathVariable("message") String message,
            @PathVariable("type") String type,
            HttpServletRequest request
    ){
        request.setAttribute("message", message);
        request.setAttribute("type", type);
        return "token";
    }
}
