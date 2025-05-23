package com.example.frontservice.dto.delivery;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class DeliveryUserResponseDTO {
    private Long uid;
    private Long userUid;
    private Long socialUid;
    private Long storeUid;
    private String merchantUid;
    private String menuName;
    private Integer amount;
    private Long price;
    private String status;
    private LocalDateTime createdDate;
    private LocalDateTime reservationDate;

    private String addressStart;
    private Double addressStartLat;
    private Double addressStartLan;
    private String addressDestination;
    private Double addressDestinationLat;
    private Double addressDestinationLan;
}
