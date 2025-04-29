package com.example.frontservice.dto.order;

import com.example.frontservice.dto.menu.CartItemsDTO;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.Valid;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class OrderRequestDTO {
    private Integer userUid;
    private Integer socialUid;
    private Integer storeUid;
    @Valid
    private List<CartItemsDTO> items;
    private String payment;
    private String merchantUid;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime reservationDate;
    private boolean paymentSuccess;
    private DeliveryAddressDTO deliveryAddress;
}
