package com.example.frontservice.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/member")
public class MemberController {

    @GetMapping("/login")
    public String login() {
        return "sign-in";
    }
    @GetMapping("/join")
    public String join() {
        return "sign-up";
    }
    @GetMapping("/profile")
    public String profile() {
        return "profile";
    }
}
