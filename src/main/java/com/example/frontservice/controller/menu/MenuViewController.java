package com.example.frontservice.controller.menu;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MenuViewController {

    @GetMapping("/menus/admin")
    public String showMenuForm() {
        return "menu/menuAdmin"; // HTML 페이지 이름
    }

    @GetMapping("/menus/list")
    public String showMenuList() {
        return "menu/menuList";
    }

    @GetMapping("/menus/edit/{menuName}")
    public String editMenu() {
        return "menu/menuEdit";
    }
}
