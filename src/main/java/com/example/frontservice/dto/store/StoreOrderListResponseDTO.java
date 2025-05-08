package com.example.frontservice.dto.store;

import com.example.frontservice.dto.order.OrderDetailResponseDTO;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;
@Getter
@Builder
public class StoreOrderListResponseDTO {
    @JsonProperty("storeOrderLists")
    private List<StoreOrderResponseDTO> storeOrderLists;  // 지점 주문 리스트

    public List<StoreOrderResponseDTO> getStoreOrderLists() {
        return storeOrderLists;
    }
    public void setStoreOrderLists(List<StoreOrderResponseDTO> storeOrderLists) {
        this.storeOrderLists = storeOrderLists;
    }

}
