package com.example.frontservice.dto.order;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CancelPaymentRequestDTO {
    private String merchantUid;
}
