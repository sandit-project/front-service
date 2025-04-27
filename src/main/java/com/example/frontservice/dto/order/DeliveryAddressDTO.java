package com.example.frontservice.dto.order;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DeliveryAddressDTO {
    private String  addressStart;
    private double  addressStartLat;
    private double  addressStartLan;
    private String  addressDestination;
    private double  addressDestinationLat;
    private double  addressDestinationLan;
}
