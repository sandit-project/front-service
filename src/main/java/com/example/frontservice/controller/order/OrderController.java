package com.example.frontservice.controller.order;

import com.example.frontservice.dto.delivery.DeliveryUserResponseDTO;
import com.example.frontservice.dto.order.*;
import com.example.frontservice.service.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @PostMapping("/orders/{userType}")
    public ResponseEntity<OrderResponseDTO> submit(HttpServletRequest request,
                                                   @PathVariable String userType,
                                                   @RequestBody OrderRequestDTO requestdto) {
        log.info("submit order::" + request.toString());
        String token = request.getHeader("Authorization");
        log.info("token::" + token);

        return ResponseEntity.ok(orderService.submit(token,userType, requestdto));
    }

    @GetMapping("/orders/user/{userType}/{userUid}")
    public ResponseEntity<List<OrderDetailResponseDTO>> listByUser(HttpServletRequest request,
                                                                   @PathVariable String userType,
                                                                   @PathVariable Integer userUid) {
        log.info("listByUser pathVar:: {},{}", userType, userUid);

        String token = request.getHeader("Authorization");

        return ResponseEntity.ok(orderService.listByUser(token, userType, userUid));
    }

    @GetMapping("/orders/user/delivering/{userType}/{userUid}")
    public ResponseEntity<List<DeliveryUserResponseDTO>> deliveringListByUser(HttpServletRequest request,
                                                                              @PathVariable String userType,
                                                                              @PathVariable Integer userUid) {
        log.info("deliveringListByUser pathVar:: {},{}", userType, userUid);

        String token = request.getHeader("Authorization");

        return ResponseEntity.ok(orderService.deliveringListByUser(token, userType, userUid));
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

    @PostMapping("/orders/payments/cancel")
    public CancelPaymentResponseDTO cancelPayment(
            HttpServletRequest request,
            @RequestBody CancelPaymentRequestDTO req
    ) {
        String token = request.getHeader("Authorization");

        log.info("요청 merchantUid: {}, reason: {}", req.getMerchantUid(), req.getReason());
        return orderService.cancelPayment(token, req);
    }

}
