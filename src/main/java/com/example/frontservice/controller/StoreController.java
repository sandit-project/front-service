package com.example.frontservice.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/store")
public class StoreController {

    @GetMapping("/register")
    public String register()
    {
       return "store-register";
    }

    @GetMapping("/list")
    public String storelist() {
        return "store-list";
    }

    @GetMapping("/detail")
    public String detail(@RequestParam(name ="uid") Long uid, Model model) {
        model.addAttribute("uid", uid); // ✅ 꼭 필요함
        return "store-detail";
    }
}
