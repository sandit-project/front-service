package com.example.frontservice.dto.store;

import com.example.frontservice.dto.menu.CartItemsDTO;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class StoreOrderResponseDTO {

    private String merchantUid;
    private Long userUid;
    private Long socialUid;
    private LocalDateTime createdDate;
    private LocalDateTime reservationDate;
    private String status;
    private String addressDestination;
    private List<ItemResponse> items;

    @Getter
    public static class ItemResponse {
        private String menuName;
        private Integer amount;
    }
}
