package com.example.frontservice.client.edge;

import com.example.frontservice.dto.order.*;
import com.example.frontservice.dto.store.StoreOrderCountResponseDTO;
import com.example.frontservice.dto.store.StoreOrderListResponseDTO;
import com.example.frontservice.dto.store.StoreOrderResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@FeignClient(name = "orderClient", url = "${sandit.edge-service-url}/orders")
public interface OrderClient {

    //결제 사전 검증
    @PostMapping("/prepare")
    PreparePaymentResponseDTO preparePayment(@RequestBody PreparePaymentRequestDTO request);

    @PostMapping
    OrderResponseDTO submitOrder(@RequestHeader("Authorization") String token, @RequestBody OrderRequestDTO request);

    @GetMapping("/user/{userUid}")
    List<OrderDetailResponseDTO> getOrdersByUserUid(@RequestHeader("Authorization") String token, @PathVariable Integer userUid);

    @PostMapping("/update-success")
    OrderResponseDTO updateOrderStatusSuccess(@RequestBody UpdateOrderStatusRequestDTO request);

    @PostMapping("/update-fail")
    OrderResponseDTO updateOrderStatusFail(@RequestBody UpdateOrderStatusRequestDTO request);

    //지점 주문 요청
    @GetMapping("/store/{storeUid}")
    StoreOrderListResponseDTO getOrdersByStoreUid(@PathVariable(name = "storeUid") Integer storeUid,
                                                  @RequestParam(name = "limit") int limit,
                                                  @RequestParam(name = "lastUid", required = false) Integer lastUid,
                                                  @RequestHeader("Authorization") String token
    );

    @GetMapping("store/{storeUid}/count")
    StoreOrderCountResponseDTO getCount(@PathVariable(name = "storeUid") Integer storeUid);

}