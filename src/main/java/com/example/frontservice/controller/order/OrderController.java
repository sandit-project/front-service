package com.example.frontservice.controller.order;

import com.example.frontservice.dto.order.*;
import com.example.frontservice.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/orders/prepare")
    public ResponseEntity<PreparePaymentResponseDTO> prepare(@RequestBody PreparePaymentRequestDTO req) {
        return ResponseEntity.ok(orderService.prepare(req));
    }

    @PostMapping("/orders")
    public ResponseEntity<OrderResponseDTO> submit(@RequestBody OrderRequestDTO req) {
        return ResponseEntity.ok(orderService.submit(req));
    }

    @GetMapping("/orders/user/{userUid}")
    public ResponseEntity<OrderDetailResponseDTO> listByUser(@PathVariable Integer userUid) {
        return ResponseEntity.ok(orderService.listByUser(userUid));
    }

    @PostMapping("/orders/update-success")
    public ResponseEntity<OrderResponseDTO> success(@RequestBody UpdateOrderStatusRequestDTO req) {
        return ResponseEntity.ok(orderService.confirmSuccess(req));
    }
}
