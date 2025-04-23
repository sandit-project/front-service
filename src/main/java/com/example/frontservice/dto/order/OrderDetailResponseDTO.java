package com.example.frontservice.dto.order;

import com.example.frontservice.dto.menu.CartItemsDTO;

import java.time.LocalDateTime;
import java.util.List;

public class OrderDetailResponseDTO {
    private Integer uid;
    private Integer userUid;
    private Integer storeUid;
    private List<CartItemsDTO> items;
    private String payment;
    private String status;
    private LocalDateTime createdDate;
    private LocalDateTime reservationDate;
}
