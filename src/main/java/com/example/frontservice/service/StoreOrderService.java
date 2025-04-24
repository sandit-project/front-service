package com.example.frontservice.service;

import com.example.frontservice.client.edge.StoreClient;
import com.example.frontservice.dto.store.StoreOrderListRequestDTO;
import com.example.frontservice.dto.store.StoreOrderListResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StoreOrderService {
    private final StoreClient storeClient;

    public StoreOrderListResponseDTO storeOrderList (StoreOrderListRequestDTO storeOrderListRequestDTO,String token) {
        return storeClient.getStoreOrderList(storeOrderListRequestDTO.getLimit(), storeOrderListRequestDTO.getLastUid(),token);
    }

}
