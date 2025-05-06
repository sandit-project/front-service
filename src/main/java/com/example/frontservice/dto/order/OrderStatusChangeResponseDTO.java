package com.example.frontservice.dto.order;

import com.example.frontservice.type.OrderStatus;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class OrderStatusChangeResponseDTO {
    private boolean success;
    private String message;
    private String merchantUid;
    private OrderStatus newStatus;
}
