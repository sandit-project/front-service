package com.example.frontservice.dto.delivery;

import com.example.frontservice.type.OrderStatus;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@Builder
@ToString
public class DeliveryStartRequestDTO {
    private String merchantUid;
    private OrderStatus status;
    private Integer riderUserUid;
    private Integer riderSocialUid;
    private String addressStart;
    private String addressDestination;
    private LocalDateTime deliveryAcceptTime;
    private LocalDateTime deliveredTime;
}
