package com.example.frontservice.dto.menu;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemsDTO {

    private Long uid;
    private String menuName;
    private int amount;
    private Long totalPrice;
    private Double calorie;
    private Long unitPrice;  // ✅ 추가
    private int version;
}


