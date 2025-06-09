package com.example.frontservice.dto.order;

import com.example.frontservice.dto.menu.CartItemsDTO;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class OrderDetailResponseDTO {
    private Integer uid;
    private Integer userUid;
    private Integer socialUid;
    private Integer storeUid;
    private String merchantUid;
    private List<CartItemsDTO> items;
    private String payment;
    private String status;
    private DeliveryAddressDTO deliveryAddress;
    private LocalDateTime createdDate;
    private LocalDateTime reservationDate;
}
