package com.example.frontservice.controller.delivery;

import com.example.frontservice.dto.delivery.DeliveryCompleteRequestDTO;
import com.example.frontservice.dto.delivery.DeliveryOrderResponseDTO;
import com.example.frontservice.dto.delivery.DeliveryResponseDTO;
import com.example.frontservice.dto.delivery.DeliveryStartRequestDTO;
import com.example.frontservice.service.DeliveryService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/delivery")
public class DeliveryApiController {
    private final DeliveryService deliveryService;

    @GetMapping("/path")
    public String getPath(
            @RequestParam("origin") String origin,
            @RequestParam("destination") String destination
    ){
        log.info("request path :: {}, {}", origin, destination);
        return deliveryService.getPath(origin,destination);
    }

    @GetMapping("/cooking")
    public List<DeliveryOrderResponseDTO> getCookingOrders(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        return deliveryService.getCookingOrders(token);
    }

    @GetMapping("/delivering")
    public List<DeliveryOrderResponseDTO> getDeliveringOrders(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        return deliveryService.getDeliveringOrders(token);
    }

    @PostMapping("/start")
    public DeliveryResponseDTO startDelivery(HttpServletRequest request,
                                             @RequestBody DeliveryStartRequestDTO deliveryStartRequestDTO) {
        String token = request.getHeader("Authorization");
        return deliveryService.startDelivery(token,deliveryStartRequestDTO);
    }

    @PostMapping("/complete")
    public DeliveryResponseDTO completeDelivery(HttpServletRequest request,
                                                @RequestBody DeliveryCompleteRequestDTO deliveryCompleteRequestDTO) {
        String token = request.getHeader("Authorization");
        return deliveryService.completeDelivery(token,deliveryCompleteRequestDTO);
    }
}
