package com.example.frontservice.controller.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/member")
public class MemberController {
    @Value("${app.websocket.url}")
    private String websocketUrl;

    @GetMapping("/login")
    public String login() {
        return "auth/sign-in";
    }
    @GetMapping("/join")
    public String join() {
        return "auth/sign-up";
    }
    @GetMapping("/profile")
    public String profile(Model model) {
        model.addAttribute("websocketUrl", websocketUrl);
        return "auth/profile";
    }
    @GetMapping("/profile/update")
    public String updateProfile(Model model) {
        model.addAttribute("websocketUrl", websocketUrl);
        return "auth/update-profile";
    }
}
