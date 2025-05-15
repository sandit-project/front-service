package com.example.frontservice.dto.menu;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SideCartRequestDTO {

    private Long uid;
//    private String sideName;
    private int amount;
//    private Long totalPrice;
//    private Double calorie;
//    private Long unitPrice;  // ✅ 추가
}