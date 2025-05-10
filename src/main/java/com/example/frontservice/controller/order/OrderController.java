package com.example.frontservice.controller.order;

import com.example.frontservice.dto.order.*;
import com.example.frontservice.service.OrderService;
import com.example.frontservice.type.OrderStatus;
import feign.FeignException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
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

    @PostMapping("/orders")
    public ResponseEntity<OrderResponseDTO> submit(HttpServletRequest request, @RequestBody OrderRequestDTO requestdto) {
        log.info("submit order::" + request.toString());
        String token = request.getHeader("Authorization");

        // Bearer 없으면 추가
        if (token != null && !token.startsWith("Bearer ")) {
            token = "Bearer " + token;
        }

        return ResponseEntity.ok(orderService.submit(token,requestdto));
    }

    @GetMapping("/orders/user/{userUid}")
    public ResponseEntity<List<OrderDetailResponseDTO>> listByUser(HttpServletRequest request, @PathVariable Integer userUid) {
        log.info("listByUser userUid::" + userUid);

        String token = request.getHeader("Authorization");

        // Bearer 없으면 추가
        if (token != null && !token.startsWith("Bearer ")) {
            token = "Bearer " + token;
        }

        return ResponseEntity.ok(orderService.listByUser(token, userUid));
    }

    
    //상태 변경
    @PutMapping("/orders/{merchantUid}/status")
    public ResponseEntity<OrderStatusChangeResponseDTO> changeStatus(
            @PathVariable String merchantUid,
            @RequestParam OrderStatus newStatus
    ) {
        log.info("changeStatus merchantUid={}, newStatus={}", merchantUid, newStatus);
        return ResponseEntity.ok(orderService.changeStatus(merchantUid, newStatus));
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
    public ResponseEntity<CancelPaymentResponseDTO> cancelPayment(
            HttpServletRequest request,
            @RequestBody CancelPaymentRequestDTO req
    ) {
        String token = request.getHeader("Authorization");

        if (token != null && !token.startsWith("Bearer ")) {
            token = "Bearer " + token;
        }
        try {
            CancelPaymentResponseDTO resp = orderService.cancelPayment(token, req);
            log.info("cancel payment::" + resp.toString());
            return ResponseEntity.status(resp.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
                    .body(resp);
        } catch (FeignException fe) {
            log.error("[cancelPayment] Feign 예외: status={}, body={}", fe.status(), fe.contentUTF8());
            CancelPaymentResponseDTO fallback = CancelPaymentResponseDTO.builder()
                    .success(false)
                    .message("결제 취소 연동 중 장애가 발생했습니다.")
                    .build();
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(fallback);
        }
    }


}
