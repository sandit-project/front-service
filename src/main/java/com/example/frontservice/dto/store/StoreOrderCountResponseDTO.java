package com.example.frontservice.dto.store;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class StoreOrderCountResponseDTO {
    int orderCount;
}
