package com.example.frontservice.controller;

import com.example.frontservice.util.CookieUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MenuController {
    @GetMapping("/home")
    public String menu(
            HttpServletRequest request,
            HttpServletResponse response
    ){
        if(request.getCookies() == null || request.getCookies().length == 0) {
            System.out.println("Cookies is empty");
            return "auth/sign-in";
        }else{
            for (Cookie cookie : request.getCookies()) {
                if ("accessToken".equals(cookie.getName())) {
                    CookieUtil.deleteCookie(request, response, "accessToken");
                }
            }
            return "menu";
        }
    }
    @GetMapping("/detail")
    public String detail(){
        return "detail";
    }
}
