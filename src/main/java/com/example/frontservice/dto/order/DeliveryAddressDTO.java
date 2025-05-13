package com.example.frontservice.dto.order;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.jackson.Jacksonized;

@Getter
@Builder
public class DeliveryAddressDTO {
    private String  addressStart;
    private Double  addressStartLat;
    private Double  addressStartLan;
    private String  addressDestination;
    private Double  addressDestinationLat;
    private Double  addressDestinationLan;
}
