package com.example.frontservice.controller.menu;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class SideMenuForCustomerViewController {



    @GetMapping("/sidesInfo/{sideName}")
    public String showMenuDetail(@PathVariable String sideName) {
        return "menu/sideMenuForCustomer"; // 화면만 반환 (HTML 처리)
    }


}



