package com.example.frontservice.service;

import com.example.frontservice.client.edge.OrderClient;
import com.example.frontservice.client.edge.StoreClient;
import com.example.frontservice.dto.store.StoreOrderCountResponseDTO;
import com.example.frontservice.dto.store.StoreOrderListRequestDTO;
import com.example.frontservice.dto.store.StoreOrderListResponseDTO;
import com.example.frontservice.dto.store.StoreOrderResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StoreOrderService {
    private final OrderClient orderClient;

    public StoreOrderListResponseDTO getOrdersByStoreUid(Integer storeUid, int limit, Integer lastUid,String status,String token) {
        StoreOrderListResponseDTO storeOrderListResponseDTO =  orderClient.getOrdersByStoreUid(storeUid,limit,lastUid,status,token);
        return storeOrderListResponseDTO;
    }

    public StoreOrderCountResponseDTO countByStoreUid(Integer storeUid,String token) {
        StoreOrderCountResponseDTO storeOrderCountResponseDTO = orderClient.getCountOrdersByStoreUid(storeUid,token);
        return storeOrderCountResponseDTO;
    }

}
