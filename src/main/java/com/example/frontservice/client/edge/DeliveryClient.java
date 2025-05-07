package com.example.frontservice.client.edge;

import com.example.frontservice.dto.delivery.DeliveryCompleteRequestDTO;
import com.example.frontservice.dto.delivery.DeliveryOrderResponseDTO;
import com.example.frontservice.dto.delivery.DeliveryResponseDTO;
import com.example.frontservice.dto.delivery.DeliveryStartRequestDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;

@FeignClient(name="deliveryClient", url="${sandit.edge-service-url}/deliveries")
public interface DeliveryClient {
    @GetMapping("status/cooking")
    List<DeliveryOrderResponseDTO> getCookingOrders(@RequestHeader("Authorization") String token);

    @GetMapping("status/delivering")
    List<DeliveryOrderResponseDTO> getDeliveringOrders(@RequestHeader("Authorization") String token);

    @PostMapping("/start")
    DeliveryResponseDTO startDelivery(@RequestHeader("Authorization") String token, @RequestBody DeliveryStartRequestDTO deliveryStartRequestDTO);

    @PostMapping("/complete")
    DeliveryResponseDTO completeDelivery(@RequestHeader("Authorization") String token, @RequestBody DeliveryCompleteRequestDTO deliveryCompleteRequestDTO);
}
