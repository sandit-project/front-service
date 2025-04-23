package com.example.frontservice.client.edge;

import com.example.frontservice.dto.order.CustomOrderRequestDTO;
import com.example.frontservice.dto.order.FinalCustomRequestDTO;
import com.example.frontservice.dto.order.OrderResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "customOrderClient", url = "${sandit.edge-service-url}/orders/custom")
public interface CustomOrderClient {

    @PostMapping
    OrderResponseDTO submitOrder(@RequestBody CustomOrderRequestDTO request);

    @PostMapping("/final")
    OrderResponseDTO submitFinalOrder(@RequestBody FinalCustomRequestDTO request);
}
