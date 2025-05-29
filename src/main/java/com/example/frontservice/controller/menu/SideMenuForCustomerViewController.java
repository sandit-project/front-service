package com.example.frontservice.controller.menu;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class SideMenuForCustomerViewController {
    @Value("${app.websocket.url}")
    private String websocketUrl;

    @GetMapping("/sidesInfo/{sideName}")
    public String showMenuDetail(@PathVariable String sideName, Model model) {
        model.addAttribute("websocketUrl", websocketUrl);
        return "menu/sideMenuForCustomer"; // 화면만 반환 (HTML 처리)
    }

}



