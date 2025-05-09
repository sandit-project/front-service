package com.example.frontservice.controller.delivery;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/delivery")
public class DeliveryController {
    @Value("${app.websocket.url}")
    private String websocketUrl;

    @GetMapping
    public String deliveryList(Model model) {
        model.addAttribute("websocketUrl", websocketUrl);
        return "/delivery/delivery-list";
    }
}
