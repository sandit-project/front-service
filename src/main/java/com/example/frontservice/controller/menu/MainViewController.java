package com.example.frontservice.controller.menu;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/admin")
public class MainViewController {

    @GetMapping
    public String adminMemuPage() {
        return "menu/main";
    }

}
