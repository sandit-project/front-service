package com.example.frontservice.controller.menu;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class SauceViewController {

    // ✅ 소스 업로드 페이지로 이동
    @GetMapping("/sauces/admin")
    public String index() {
        return "sauceAdmin";  // Thymeleaf 템플릿 (sauceAdmin.html)
    }

    // ✅ 소스 목록 조회 페이지
    @GetMapping("/sauces/list")
    public String viewSauceList() {
        return "sauceList"; // sauceList.html 파일로 이동
    }

    // ✅ 특정 소스 수정 페이지
    @GetMapping("/sauces/edit/{sauceName}")
    public String editSauce(@PathVariable String sauceName) {
        return "sauceEdit";  // sauceEdit.html 파일로 이동
    }
}
