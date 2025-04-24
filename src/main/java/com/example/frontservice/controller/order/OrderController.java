package com.example.frontservice.controller.order;

import com.example.frontservice.dto.order.*;
import com.example.frontservice.service.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/orders/prepare")
    public ResponseEntity<PreparePaymentResponseDTO> prepare(@RequestBody PreparePaymentRequestDTO request) {
        log.info("preparing order::" + request.toString());
        return ResponseEntity.ok(orderService.prepare(request));
    }

    @PostMapping("/orders")
    public ResponseEntity<OrderResponseDTO> submit(HttpServletRequest request, @RequestBody OrderRequestDTO requestdto) {
        log.info("submit order::" + request.toString());
        String token = request.getHeader("Authorization");
        return ResponseEntity.ok(orderService.submit(token,requestdto));
    }

    @GetMapping("/orders/user/{userUid}")
    public ResponseEntity<OrderDetailResponseDTO> listByUser(@PathVariable Integer userUid) {
        log.info("listByUser userUid::" + userUid);
        return ResponseEntity.ok(orderService.listByUser(userUid));
    }

    @PostMapping("/orders/update-success")
    public ResponseEntity<OrderResponseDTO> success(@RequestBody UpdateOrderStatusRequestDTO request) {
        log.info("update order success::" + request.toString());
        return ResponseEntity.ok(orderService.confirmSuccess(request));
    }

    @PostMapping("/orders/update-fail")
    public ResponseEntity<OrderResponseDTO> updateOrderStatusFail(@RequestBody UpdateOrderStatusRequestDTO request) {
        log.info("update order fail::" + request.toString());
        return ResponseEntity.ok(orderService.confirmFail(request));
    }
}
