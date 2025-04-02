package com.example.frontservice.controller;

import com.example.frontservice.dto.*;
import com.example.frontservice.service.AuthService;
import com.example.frontservice.util.CookieUtil;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class AuthApiController {
    private final AuthService authService;

    @PostMapping("/join")
    public JoinResponseDTO join(@RequestBody JoinRequestDTO joinRequestDTO) {
        return authService.join(joinRequestDTO).toJoinResponseDTO();
    }

    @PostMapping("/login")
    public LoginResponseDTO login(
            HttpServletResponse response,
            @RequestBody LoginRequestDTO loginRequestDTO
    ) {
        LoginClientResponseDTO logined = authService.login(loginRequestDTO);

        if(logined != null && logined.isLoggedIn()) {
            CookieUtil.addCookie(response,"refreshToken", logined.getRefreshToken(), 7*24*60*60);
        }

        assert logined != null;

        return logined.toLoginResponseDTO();
    }

}
