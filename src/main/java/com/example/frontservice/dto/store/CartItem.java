package com.example.frontservice.dto.store;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
//메뉴 1개의 정보 (프론트랑 통신하는 DTO)
public record CartItem(

   Integer cartUid,
   @NotBlank(message = "menu must be defined")
   String menuName,
   @NotNull(message = "amount must be defined")
   @Min(value = 1, message = "You must order at least 1 item.")
   int amount,
   @NotNull(message = "price must be defined")
   @Min(value = 1, message = "Price at least 1")
   int price,
   @NotNull(message = "calorie must be defined")
   @Min(value = 1, message = "Calorie at least 1")
   Double calorie
){

}

