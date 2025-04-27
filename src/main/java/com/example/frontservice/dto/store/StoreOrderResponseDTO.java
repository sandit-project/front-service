package com.example.frontservice.dto.store;

import com.example.frontservice.dto.menu.CartItemsDTO;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class StoreOrderResponseDTO {
    private Long storeUid;
    private String status;
    private LocalDateTime createdDate;
    private List<CartItemsDTO> items;
}
