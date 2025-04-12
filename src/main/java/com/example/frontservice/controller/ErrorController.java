package com.example.frontservice.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;

@Controller
public class ErrorController {
    @GetMapping("/access-denied")
    public String getAccessDenied() {
        return "access-denied";
    }
    @PutMapping("/access-denied")
    public String putAccessDenied() {
        return "access-denied";
    }
    @DeleteMapping("/access-denied")
    public String deleteAccessDenied() {
        return "access-denied";
    }
    @GetMapping("/service-unavailable")
    public String getServiceUnavailable() {
        return "service-unavailable";
    }
    @PutMapping("/service-unavailable")
    public String putServiceUnavailable() {
        return "service-unavailable";
    }
    @DeleteMapping("/service-unavailable")
    public String deleteServiceUnavailable() {
        return "service-unavailable";
    }
}
