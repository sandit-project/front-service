package com.example.frontservice.client.edge;

import com.example.frontservice.dto.delivery.DeliveryOrderResponseDTO;
import com.example.frontservice.dto.order.*;
import com.example.frontservice.dto.store.StoreOrderCountResponseDTO;
import com.example.frontservice.dto.store.StoreOrderListResponseDTO;
import com.example.frontservice.type.OrderStatus;
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
    List<OrderDetailResponseDTO> getOrdersByUserUid(@RequestHeader("Authorization") String token, @PathVariable Integer userUid);

    @PutMapping("/{merchantUid}/status")
    OrderStatusChangeResponseDTO changeOrderStatus(@RequestHeader("Authorization") String token,
                                                   @PathVariable("merchantUid") String merchantUid,
                                                   @RequestParam("newStatus") OrderStatus newStatus);

    @PostMapping("/update-success")
    OrderResponseDTO updateOrderStatusSuccess(@RequestBody UpdateOrderStatusRequestDTO request);

    @PostMapping("/update-fail")
    OrderResponseDTO updateOrderStatusFail(@RequestBody UpdateOrderStatusRequestDTO request);

    @PostMapping(value = "/payments/cancel",
            consumes = "application/json",
            produces = "application/json")
    List<CancelPaymentResponseDTO> cancelPayment(@RequestHeader("Authorization") String token, @RequestBody CancelPaymentRequestDTO request
    );

    @PostMapping("/payments/init")
    void initCancel(@RequestHeader("Authorization") String token, @RequestBody CancelPaymentRequestDTO dto);

    @PostMapping("/payments/confirm")
    void confirmCancel(@RequestHeader("Authorization") String token, @RequestBody CancelPaymentRequestDTO dto);

    @PostMapping("/payments/compensate")
    void compensateCancel(@RequestHeader("Authorization") String token, @RequestBody CancelPaymentRequestDTO dto);


    //지점 주문 요청 (응답 타입을 리스트로 바로 받음)
    @GetMapping("/store/{storeUid}")
    StoreOrderListResponseDTO getOrdersByStoreUidAndStatus(@PathVariable(name = "storeUid") Integer storeUid,
                                                  @RequestParam(name = "status", required = false) String status,
                                                  @RequestHeader("Authorization") String token
    );
    // 지점 주문 총 갯수 요청
    @GetMapping("store/{storeUid}/count")
    StoreOrderCountResponseDTO getCountOrdersByStoreUid(@PathVariable(name = "storeUid") Integer storeUid,
                                                        @RequestHeader("Authorization") String token);

}