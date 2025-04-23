package com.example.frontservice.dto.order;

import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class PreparePaymentRequestDTO {
    private String menuName;
    private Integer totalPrice;
    private String merchantUid;
    private LocalDateTime reservationDate;
    private Integer storeUid;
    private Integer userUid;
}
