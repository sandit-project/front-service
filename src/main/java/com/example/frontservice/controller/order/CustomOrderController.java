package com.example.frontservice.controller.order;

import com.example.frontservice.dto.order.CustomOrderRequestDTO;
import com.example.frontservice.dto.order.FinalCustomRequestDTO;
import com.example.frontservice.dto.order.OrderResponseDTO;
import com.example.frontservice.service.CustomOrderService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping
public class CustomOrderController {

    private final CustomOrderService customOrderService;

    @PostMapping("/orders/custom/final")
    public ResponseEntity<OrderResponseDTO> submitFinalOrder(HttpServletRequest request, @RequestBody FinalCustomRequestDTO finalCustomRequestDTO) {
        log.info("submit Final custom order::" + request.toString());
        String token = request.getHeader("Authorization");
        return ResponseEntity.ok(customOrderService.submitFinalOrder(token,finalCustomRequestDTO));
    }
}
