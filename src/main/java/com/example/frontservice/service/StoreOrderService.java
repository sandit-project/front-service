package com.example.frontservice.service;

import com.example.frontservice.client.edge.OrderClient;
import com.example.frontservice.client.edge.StoreClient;
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

    public List<StoreOrderResponseDTO> getAllOrders(Long storeUid, int limit, int lastUid,String token) {
        return orderClient.getOrdersByStoreUid(storeUid,limit,lastUid,token);
    }

}
