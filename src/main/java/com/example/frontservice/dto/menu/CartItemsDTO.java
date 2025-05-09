package com.example.frontservice.dto.menu;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemsDTO {
    private Long userUid;
    private Long socialUid;
    private Long uid;
    private String menuName;
    private int amount;
    private Long totalPrice;
    private Double calorie;
    private Long unitPrice;
    private String img;
}


