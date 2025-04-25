package com.example.frontservice.dto.order;

import lombok.Getter;

@Getter
public class FinalCustomRequestDTO {
    private Integer customOptionUid;
    private OrderRequestDTO orderRequestDTO;
    private CustomOrderRequestDTO customOrderRequestDTO;
}
