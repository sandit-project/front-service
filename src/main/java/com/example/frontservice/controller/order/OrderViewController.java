package com.example.frontservice.controller.order;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/order")
@RequiredArgsConstructor
public class OrderViewController {
    @Value("${app.websocket.url}")
    private String websocketUrl;

    @GetMapping
    public String orderPage() {
        return "order/order";
    }

    @GetMapping("/details")
    public String orderDetailPage(Model model) {
        model.addAttribute("websocketUrl", websocketUrl);
        return "order/order-detail";
    }
}
