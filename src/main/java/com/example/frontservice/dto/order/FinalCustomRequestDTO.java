package com.example.frontservice.dto.order;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.util.List;

@Getter
@Builder
@ToString
public class FinalCustomRequestDTO {
    private OrderRequestDTO orderRequestDTO;
    private List<CustomOrderRequestDTO> customOrderRequestDTO;
}
