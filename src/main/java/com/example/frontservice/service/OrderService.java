package com.example.frontservice.service;

import com.example.frontservice.client.edge.OrderClient;
import com.example.frontservice.dto.order.*;
import com.example.frontservice.type.OrderStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderClient orderClient;

    //결제 사전 검증
    public PreparePaymentResponseDTO prepare(PreparePaymentRequestDTO request) {
        return orderClient.preparePayment(request);
    }

    //주문
    public OrderResponseDTO submit(String token, OrderRequestDTO request) {
        return orderClient.submitOrder(token, request);
    }

    //주문 내역 확인
    public List<OrderDetailResponseDTO> listByUser(String token, Integer userUid) {
        return orderClient.getOrdersByUserUid(token, userUid);
    }

    //상태 변경
    public OrderStatusChangeResponseDTO changeStatus(String merchantUid, OrderStatus newStatus) {
        return orderClient.changeOrderStatus(merchantUid, newStatus);
    }


    //결제 완료 상태로 상태 변환
    public OrderResponseDTO confirmSuccess(UpdateOrderStatusRequestDTO request) {
        return orderClient.updateOrderStatusSuccess(request);
    }

    //결제 실패 상태로 상태 변환
    public OrderResponseDTO confirmFail(UpdateOrderStatusRequestDTO request) {
        return orderClient.updateOrderStatusFail(request);
    }

    // 결제 취소
    public CancelPaymentResponseDTO cancelPayment(String token, CancelPaymentRequestDTO request) {
        CancelPaymentResponseDTO response = orderClient.updateCancelStatus(token, request);

        // 실패한 경우 로그 남기기
        if (!response.isSuccess()) {
            log.warn("결제 취소 실패: {}", response.getMessage());
        }

        return response;
    }

}
