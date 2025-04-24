package com.example.frontservice.dto.menu;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartResponseDTO {

    private int totalQuantity;  // 총 수량
    private long totalPrice;    // 총 가격
    private List<CartItemsDTO> cartItems;  // 장바구니 항목

    // 생성자에서 CartItemDTO 리스트로 총합을 계산
    public CartResponseDTO(List<CartItemsDTO> cartItems) {
        this.cartItems = cartItems;
        this.totalQuantity = cartItems.stream().mapToInt(CartItemsDTO::getAmount).sum();
        this.totalPrice = cartItems.stream().mapToLong(item -> item.getAmount() * item.getUnitPrice()).sum();
    }
}
