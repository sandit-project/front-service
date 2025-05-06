package com.example.frontservice.service;

import com.example.frontservice.client.edge.CustomOrderClient;
import com.example.frontservice.dto.order.CustomOrderRequestDTO;
import com.example.frontservice.dto.order.FinalCustomRequestDTO;
import com.example.frontservice.dto.order.OrderResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

@Service
@RequiredArgsConstructor
public class CustomOrderService {

    private final CustomOrderClient customOrderClient;

    //최종 주문
    public OrderResponseDTO submitFinalOrder(String token, @RequestBody FinalCustomRequestDTO request) {
        return customOrderClient.submitFinalOrder(token,request);
    }
}
