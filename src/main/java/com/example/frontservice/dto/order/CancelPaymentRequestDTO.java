package com.example.frontservice.dto.order;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CancelPaymentRequestDTO {
    @JsonProperty("merchant_uid")
    private String merchantUid;
    private String reason;
}
