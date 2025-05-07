package com.example.frontservice.dto.store;

import com.example.frontservice.type.OrderStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class RemoteOrderRequestDTO {
    private String merchantUid;
    private OrderStatus status;
    private Integer riderUserUid;
    private Integer riderSocialUid;
    private String addressStart;
    private String addressDestination;
    private LocalDateTime deliveryAcceptTime;
    private LocalDateTime deliveredTime;
}
