package com.example.frontservice.controller.menu;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MainViewController {

    @GetMapping("/admin")
    public String adminMainPage() {
        return "main";
    }
}
