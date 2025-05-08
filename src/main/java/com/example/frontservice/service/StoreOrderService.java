package com.example.frontservice.service;

import com.example.frontservice.client.edge.OrderClient;
import com.example.frontservice.dto.delivery.DeliveryOrderResponseDTO;
import com.example.frontservice.dto.store.StoreOrderCountResponseDTO;
import com.example.frontservice.dto.store.StoreOrderListResponseDTO;
import com.example.frontservice.dto.store.StoreOrderResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StoreOrderService {
    private final OrderClient orderClient;

    public List<StoreOrderResponseDTO> getOrdersByStoreUidAndStatus(Integer storeUid,String status,String token) {
        StoreOrderListResponseDTO storeOrderListResponseDTO = orderClient.getOrdersByStoreUidAndStatus(storeUid,status,token);
        return storeOrderListResponseDTO.getStoreOrderLists();
    }

    public StoreOrderCountResponseDTO countByStoreUid(Integer storeUid,String token) {
        StoreOrderCountResponseDTO storeOrderCountResponseDTO = orderClient.getCountOrdersByStoreUid(storeUid,token);
        return storeOrderCountResponseDTO;
    }

}
