package com.example.frontservice.controller.menu;



import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller

public class MenuCustomerListViewController {
    @Value("${app.websocket.url}")
    private String websocketUrl;



    // 고객용 메뉴 목록 페이지
    @GetMapping("/")
    public String showCustomerMenuList(Model model) {

        model.addAttribute("websocketUrl", websocketUrl);
        return "menu/menuCustomerList"; // Model 제거
    }
}


