package com.example.frontservice.dto.store;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class StoreOrderListRequestDTO {
    private int limit;
    private Long lastUid;
}
