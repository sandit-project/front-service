package com.example.frontservice.controller.menu;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class MaterialViewController {

    // ✅ 재료 업로드 페이지로 이동
    @GetMapping("/materials/admin")
    public String index() {
        return "menu/materialAdmin";  // Thymeleaf 템플릿 (materialAdmin.html)
    }

    // ✅ 재료 목록 조회 페이지
    @GetMapping("/materials/list")
    public String viewMaterialList() {
        return "menu/materialList"; // materialList.html 파일로 이동
    }

    // ✅ 특정 재료 수정 페이지
    @GetMapping("/materials/edit/{materialName}")
    public String editMaterial(@PathVariable String materialName) {
        return "menu/materialEdit";  // materialEdit.html 파일로 이동
    }
}
