package com.example.frontservice.dto.order;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class PreparePaymentResponseDTO {
    private String merchantUid;
    private Integer requestedAmount;
    private String message;
}
