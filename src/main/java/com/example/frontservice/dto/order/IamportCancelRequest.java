package com.example.frontservice.dto.order;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class IamportCancelRequest {
    @JsonProperty("merchant_uid")
    private String merchantUid;
    private String reason;
    private Integer amount;
    private Integer checksum;
}
