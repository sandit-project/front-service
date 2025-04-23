package com.example.frontservice.service;

import com.example.frontservice.client.edge.OrderClient;
import com.example.frontservice.dto.order.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderClient orderClient;

    //결제 사전 검증
    public PreparePaymentResponseDTO prepare(PreparePaymentRequestDTO request) {
        return orderClient.preparePayment(request);
    }

    //주문
    public OrderResponseDTO submit(OrderRequestDTO request) {
        return orderClient.submitOrder(request);
    }

    public OrderDetailResponseDTO listByUser(Integer userUid) {
        return orderClient.getOrdersByUserUid(userUid);
    }

    public OrderResponseDTO confirmSuccess(UpdateOrderStatusRequestDTO request) {
        return orderClient.updateOrderStatusSuccess(request);
    }
}
