package com.example.frontservice.controller.menu;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class SideViewController {

    // ✅ 사이드 업로드 페이지로 이동
    @GetMapping("/sides/admin")
    public String index() {
        return "sideAdmin";  // Thymeleaf 템플릿 (sideAdmin.html)
    }

    // ✅ 사이드 목록 조회 페이지
    @GetMapping("/sides/list")
    public String viewSideList() {
        return "sideList"; // sideList.html 파일로 이동
    }

    // ✅ 특정 사이드 수정 페이지
    @GetMapping("/sides/edit/{sideName}")
    public String editSide(@PathVariable String sideName) {
        return "sideEdit";  // sideEdit.html 파일로 이동
    }
}
