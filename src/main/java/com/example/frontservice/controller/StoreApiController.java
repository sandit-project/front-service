package com.example.frontservice.controller;

import com.example.frontservice.dto.store.StoreRequestDTO;
import com.example.frontservice.dto.store.StoreResponseDTO;
import com.example.frontservice.service.StoreService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class StoreApiController {

    private final StoreService storeService;

    @PostMapping("/stores")
    StoreResponseDTO addStore (StoreRequestDTO storeRequestDTO, HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        return storeService.addStore(storeRequestDTO, token);
    }
}
