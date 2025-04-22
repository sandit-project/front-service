package com.example.frontservice.dto.menu;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CartItemsDTO {

    private Long uid;
    private String menuName;
    private int amount;
    private Long totalPrice;
    private Double calorie;
    private Long unitPrice;  // ✅ 추가
}


