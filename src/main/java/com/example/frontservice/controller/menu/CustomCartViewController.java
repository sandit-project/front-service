package com.example.frontservice.controller.menu;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller

public class CustomCartViewController {
    @Value("${app.websocket.url}")
    private String websocketUrl;

    @GetMapping("/customCart")
    public String showCustomCartForm(Model model) {
        model.addAttribute("websocketUrl", websocketUrl);
        return "menu/customCart";  // 재료 없이 뷰만 반환
    }
}
