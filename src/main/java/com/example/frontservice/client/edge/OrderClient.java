package com.example.frontservice.client.edge;

import com.example.frontservice.dto.order.*;
import com.example.frontservice.dto.store.StoreOrderListResponseDTO;
import com.example.frontservice.dto.store.StoreOrderResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "orderClient", url = "${sandit.edge-service-url}/orders")
public interface OrderClient {

    //결제 사전 검증
    @PostMapping("/prepare")
    PreparePaymentResponseDTO preparePayment(@RequestBody PreparePaymentRequestDTO request);

    @PostMapping
    OrderResponseDTO submitOrder(@RequestHeader("Authorization") String token, @RequestBody OrderRequestDTO request);

    @GetMapping("/user/{userUid}")
    OrderDetailResponseDTO getOrdersByUserUid(@PathVariable Integer userUid);

    @PostMapping("/update-success")
    OrderResponseDTO updateOrderStatusSuccess(@RequestBody UpdateOrderStatusRequestDTO request);

    @PostMapping("/update-fail")
    OrderResponseDTO updateOrderStatusFail(@RequestBody UpdateOrderStatusRequestDTO request);

    //지점 주문 요청
    @GetMapping("/store/{storeUid}")
    StoreOrderListResponseDTO getOrdersByStoreUid(  @PathVariable("storeUid") Long storeUid,
                                                    @RequestParam("limit") int limit,
                                                    @RequestParam(value = "lastUid", required = false) int lastUid,
                                                    @RequestHeader("Authorization") String token
    );


}
