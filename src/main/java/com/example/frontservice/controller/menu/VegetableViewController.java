package com.example.frontservice.controller.menu;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class VegetableViewController {

    // ✅ 채소 업로드 페이지로 이동
    @GetMapping("/vegetables/admin")
    public String index() {
        return "menu/vegetableAdmin";  // Thymeleaf 템플릿 (vegetableAdmin.html)
    }

    // ✅ 채소 목록 조회 페이지
    @GetMapping("/vegetables/list")
    public String viewVegetableList() {
        return "menu/vegetableList"; // vegetableList.html 파일로 이동
    }

    // ✅ 특정 채소 수정 페이지
    @GetMapping("/vegetables/edit/{vegetableName}")
    public String editVegetable(@PathVariable String vegetableName) {
        return "menu/vegetableEdit";  // vegetableEdit.html 파일로 이동
    }
}
