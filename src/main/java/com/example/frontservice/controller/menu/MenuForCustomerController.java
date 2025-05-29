package com.example.frontservice.controller.menu;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class MenuForCustomerController {
    @Value("${app.websocket.url}")
    private String websocketUrl;

    @GetMapping("/menus/name/{menuName}")
    public String showMenuDetail(@PathVariable String menuName, Model model) {
        model.addAttribute("websocketUrl", websocketUrl);
        return "menu/menuForCustomer"; // 화면만 반환 (HTML 처리)
    }

}



