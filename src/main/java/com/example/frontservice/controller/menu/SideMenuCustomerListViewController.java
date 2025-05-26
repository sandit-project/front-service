package com.example.frontservice.controller.menu;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;



@Controller
public class SideMenuCustomerListViewController {
    @Value("${app.websocket.url}")
    private String websocketUrl;

    @GetMapping("/sidesList")
    public String showSideMenuDetail(Model model) {
        model.addAttribute("websocketUrl", websocketUrl);

        return "menu/sideMenuCustomerList";
    }


}

