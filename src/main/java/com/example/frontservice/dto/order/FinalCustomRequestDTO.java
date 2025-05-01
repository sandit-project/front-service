package com.example.frontservice.dto.order;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@Builder
@ToString
public class FinalCustomRequestDTO {
    //private Integer customOptionUid;
    private OrderRequestDTO orderRequestDTO;
    private CustomOrderRequestDTO customOrderRequestDTO;
}
