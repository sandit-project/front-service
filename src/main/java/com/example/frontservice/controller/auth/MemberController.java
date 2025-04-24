package com.example.frontservice.controller.auth;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/member")
public class MemberController {

    @GetMapping("/login")
    public String login() {
        return "auth/sign-in";
    }
    @GetMapping("/join")
    public String join() {
        return "auth/sign-up";
    }
    @GetMapping("/profile")
    public String profile() {
        return "auth/profile";
    }
    @GetMapping("/profile/update")
    public String updateProfile() {
        return "auth/update-profile";
    }
}
