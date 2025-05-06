package com.example.frontservice.dto.delivery;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DeliveryResponseDTO {
    private boolean isSuccess;
    private String message;
}
