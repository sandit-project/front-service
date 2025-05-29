package com.example.frontservice.controller.menu;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class CartViewController {
    @Value("${app.websocket.url}")
    private String websocketUrl;

    @GetMapping("/cart")
    public String viewCart(Model model) {
        model.addAttribute("websocketUrl", websocketUrl);
        return "menu/cartList"; // cartList.html
    }
}


