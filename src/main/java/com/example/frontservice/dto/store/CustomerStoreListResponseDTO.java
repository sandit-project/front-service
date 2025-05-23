package com.example.frontservice.dto.store;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CustomerStoreListResponseDTO {

    private String  storeName;
    private String  storeAddress;
    private Double  storeLatitude;
    private Double  storeLongitude;

}
