package com.example.frontservice.service;

import com.example.frontservice.client.edge.OrderClient;
import com.example.frontservice.dto.order.*;
import com.example.frontservice.type.OrderStatus;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderClient orderClient;
    private final PaymentService paymentService;

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
    public OrderStatusChangeResponseDTO changeStatus(String token, String merchantUid, OrderStatus newStatus) {
        return orderClient.changeOrderStatus(token, merchantUid, newStatus);
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
    public CancelPaymentResponseDTO cancelPayment(
            String token,
            CancelPaymentRequestDTO req
    ) {
        // 1) merchantUid 로 imp_uid, amount 등을 조회
        JsonNode info = paymentService.getPaymentInfo(req.getMerchantUid());
        String impUid    = info.get("imp_uid").asText();
        int    amount    = info.get("amount").asInt();
        int    checksum  = amount; // 필요에 따라 달리 구성

        // 2) 실제 환불 요청
        CancelPaymentResponseDTO resp =
                paymentService.cancelPayment(impUid, amount, req.getReason(), checksum);

        // 3) CANCELLED 상태로 주문 상태 변경
        if (resp.isSuccess()) {
            orderClient.changeOrderStatus(
                    token,
                    req.getMerchantUid(),
                    OrderStatus.ORDER_CANCELLED
            );
        }
        return resp;
    }

}
