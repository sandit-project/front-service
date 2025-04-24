package com.example.frontservice.controller.review;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/review")
public class ReviewViewController {

    @GetMapping
    public String reviewPage(Model model) {
        return "review/review";
    }
}
