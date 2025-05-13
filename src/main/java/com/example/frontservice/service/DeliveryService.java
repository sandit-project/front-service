package com.example.frontservice.service;

import com.example.frontservice.client.edge.DeliveryClient;
import com.example.frontservice.client.edge.OrderClient;
import com.example.frontservice.client.kakao.MobilityClient;
import com.example.frontservice.dto.delivery.DeliveryCompleteRequestDTO;
import com.example.frontservice.dto.delivery.DeliveryOrderResponseDTO;
import com.example.frontservice.dto.delivery.DeliveryResponseDTO;
import com.example.frontservice.dto.delivery.DeliveryStartRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DeliveryService {
    private final DeliveryClient deliveryClient;
    @Value("${kakao.rest.api-key}")
    private String kakaoApiKey;

    private final MobilityClient mobilityClient;

    public String getPath(String origin, String destination) {
        return mobilityClient.getPath("KakaoAK " + kakaoApiKey, origin, destination, "RECOMMEND");
    }

    public List<DeliveryOrderResponseDTO> getCookingOrders(String token) {
        return deliveryClient.getCookingOrders(token);
    }

    public List<DeliveryOrderResponseDTO> getDeliveringOrders(String token,String type,Integer uid) {
        return deliveryClient.getDeliveringOrders(token,type,uid);
    }

    public DeliveryResponseDTO startDelivery(String token, DeliveryStartRequestDTO deliveryStartRequestDTO) {
        return deliveryClient.startDelivery(token,deliveryStartRequestDTO);
    }

    public DeliveryResponseDTO completeDelivery(String token, DeliveryCompleteRequestDTO deliveryCompleteRequestDTO) {
        return deliveryClient.completeDelivery(token,deliveryCompleteRequestDTO);
    }
}
