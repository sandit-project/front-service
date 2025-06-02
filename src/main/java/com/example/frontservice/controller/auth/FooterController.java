package com.example.frontservice.controller.auth;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class FooterController {

    //회사소개
    @GetMapping("/introduce")
    public String introduce() {
        return "auth/introduce";
    }

    //개인정보처리방침
    @GetMapping("/policy")
    public String policy() {
        return "auth/policy";
    }

    //이용 약관
    @GetMapping("/terms")
    public String terms() {
        return "auth/terms";
    }
}
