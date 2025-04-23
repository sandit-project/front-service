package com.example.frontservice.dto.store;

import lombok.Builder;
import lombok.Getter;

import java.time.Instant;

@Getter
@Builder
public class StoreResponseDTO {
    private Long    uid;
    private String  storeName;
    private String  storeAddress;
    private String  storePostcode;
    private Double  storeLatitude;
    private Double  storeLongitude;
    private String  storeStatus;
    private Instant storeCreatedDate;
}