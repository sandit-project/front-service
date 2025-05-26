package com.example.frontservice.controller.store;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/store")
public class StoreController {

    @Value("${kakao.map.js-key}")
    private String kakaoJsKey;

    @GetMapping("/customer-list")
    public String storeCustomerList(Model model) {
        model.addAttribute("kakaoJsKey", kakaoJsKey);
        return "store/customer-store-list";
    }

    @GetMapping("/register")
    public String register()
    {
       return "store/store-register";
    }

    @GetMapping("/list")
    public String storelist() {
        return "store/store-list";
    }

    @GetMapping("/detail")
    public String detail(@RequestParam(name ="storeUid") Long storeUid, Model model) {
        model.addAttribute("storeUid", storeUid); // ✅ 꼭 필요함
        return "store/store-detail";
    }
    @GetMapping("/order")
    public String order() {
        return "store/store-order-list";
    }
}
