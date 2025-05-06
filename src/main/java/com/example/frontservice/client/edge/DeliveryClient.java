package com.example.frontservice.client.edge;

import com.example.frontservice.dto.delivery.DeliveryCompleteRequestDTO;
import com.example.frontservice.dto.delivery.DeliveryResponseDTO;
import com.example.frontservice.dto.delivery.DeliveryStartRequestDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name="deliveryClient", url="${sandit.edge-service-url}/deliveries")
public interface DeliveryClient {
    @PostMapping("/start")
    DeliveryResponseDTO startDelivery(@RequestHeader("Authorization") String token, @RequestBody DeliveryStartRequestDTO deliveryStartRequestDTO);

    @PostMapping("/complete")
    DeliveryResponseDTO completeDelivery(@RequestHeader("Authorization") String token, @RequestBody DeliveryCompleteRequestDTO deliveryCompleteRequestDTO);
}
