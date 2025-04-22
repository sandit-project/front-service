package com.example.frontservice.controller.menu;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class MenuForCustomerController {



    @GetMapping("/menus/name/{menuName}")
    public String showMenuDetail(@PathVariable String menuName) {
        return "menuForCustomer"; // 화면만 반환 (HTML 처리)
    }


}



