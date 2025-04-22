package com.example.frontservice.dto.store;

import lombok.Getter;

@Getter
public class StoreRequestDTO {
    private String storeName;
    private String storeAddress;
    private String storeAddressDetail;
    private String storePostcode;
    private String storeStatus;
    private Double storeLatitude;
    private Double storeLongitude;
}
