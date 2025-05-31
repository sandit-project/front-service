package com.example.frontservice.dto.order;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CancelPaymentRequestDTO {
    @JsonProperty("merchant_uid")
    private String merchantUid;
    private String reason;
}
