package com.example.frontservice.controller.order;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/order")
@RequiredArgsConstructor
public class OrderViewController {

    @GetMapping
    public String orderPage(Model model) {
        return "order/order";
    }

    @GetMapping("/{userUid}")
    public String orderDetailPage(@PathVariable("userUid") Integer userUid, Model model) {
        return "order/order-detail";
    }
}
