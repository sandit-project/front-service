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
    public List<OrderDetailResponseDTO> listByUser(String token, String userType, Integer userUid) {
        return orderClient.getOrdersByUserUid(token, userType, userUid);
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

    // 결제 취소 (필터 걸기)
    public CancelPaymentResponseDTO cancelPayment(
            String token,
            CancelPaymentRequestDTO req
    ) {

        List<OrderDetailResponseDTO> orders = orderClient.getOrdersByMerchantUid(token, req.getMerchantUid());
        if (orders.isEmpty()) {
            throw new IllegalArgumentException("해당 주문을 찾을 수 없습니다.");
        }

        OrderStatus status = OrderStatus.valueOf(orders.get(0).getStatus());
        if (status != OrderStatus.PAYMENT_COMPLETED) {
            throw new IllegalStateException("현재 상태에서는 결제 취소가 불가능합니다.");
        }

        // 1) 준비 단계: 이전 상태 저장 & DB 상태 → CANCELLED
        orderClient.initCancel(token, req);
        // 2) PortOne 정보 조회 & 취소
        JsonNode info = paymentService.getPaymentInfo(req.getMerchantUid());
        String impUid = info.get("imp_uid").asText();
        int amount    = info.get("amount").asInt();
        int checksum  = amount;
        CancelPaymentResponseDTO resp =
        paymentService.cancelPayment(impUid, req.getMerchantUid(), amount, req.getReason(), checksum);
        // 3) 결과에 따라 확정 or 보상 트랜잭션
        if (resp.isSuccess()) {
            orderClient.confirmCancel(token, req);
        } else{
                orderClient.compensateCancel(token, req);
            }
            return resp;
    }

//    public void initCancel(String token, CancelPaymentRequestDTO dto) {
//        orderClient.initCancel(token, dto);
//    }
//
//    public void confirmCancel(String token, CancelPaymentRequestDTO dto) {
//        orderClient.confirmCancel(token, dto);
//    }
//
//    public void compensateCancel(String token, CancelPaymentRequestDTO dto) {
//        orderClient.compensateCancel(token, dto);
//    }


}
