package com.example.frontservice.controller.menu;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class BreadViewController {

    // 빵 관리 페이지로 이동
    @GetMapping("/breads/admin")
    public String index() {
        return "breadAdmin";  // breadAdmin.html 페이지로 이동
    }

    // 빵 목록 조회 페이지로 이동
    @GetMapping("/breads/list")
    public String viewBreadList() {
        return "breadList";  // breadList.html 페이지로 이동
    }

    // 빵 수정 페이지로 이동
    @GetMapping("/breads/edit/{breadName}")
    public String editBread() {
        return "breadEdit";  // breadEdit.html 페이지로 이동
    }
}
