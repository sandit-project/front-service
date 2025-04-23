package com.example.frontservice.dto.store;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StoreRequestDTO {
    private String storeName;
    private String storeAddress;
    private String storePostcode;
    private Double storeLatitude;
    private Double storeLongitude;
    private String storeStatus;
}
