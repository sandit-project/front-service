package com.example.frontservice.service;

import com.example.frontservice.client.edge.StoreClient;
import com.example.frontservice.dto.store.*;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class StoreService {

    private final StoreClient storeClient;

    public boolean isManagerAlreadyAssigned (Long userUid, String token) {
        ResponseEntity<Map<String,Boolean>> response =storeClient.checkManagerAssigned(userUid, token);
        return response.getBody().getOrDefault("assigned",false);
    }

    public StoreListResponseDTO getAllStores (StoreListRequestDTO storeListRequestDTO,String token) {

        return storeClient.getStoreList(storeListRequestDTO.getLimit(), storeListRequestDTO.getLastUid(),token);
    }

    public List<CustomerStoreListResponseDTO> getStores (String token) {

        return storeClient.getCustomerStoreList(token);
    }

    public StoreResponseDTO getStore (Long storeUid,String token) {
        return storeClient.getStore(storeUid,token);
    }

    public StoreUidResponseDTO getStoreUidByManager(Long managerUid,String token){
        return storeClient.getStoreUidByManager(managerUid,token);
    }

    public StoreResponseDTO addStore(StoreRequestDTO storeRequestDTO,String token) {
        return storeClient.addStore(storeRequestDTO,token);
    }

    public StoreResponseDTO updateStore(Long storeUid, StoreRequestDTO storeRequestDTO,String token) {
        return storeClient.updateStore(storeUid, storeRequestDTO,token);
    }

    public void deleteStore(Long storeUid,String token) {
        storeClient.deleteStore(storeUid,token);
    }

    public RemoteOrderResponseDTO remoteOrder(String token, String action, RemoteOrderRequestDTO remoteOrderRequestDTO) {
        return storeClient.remoteOrder(token, action, remoteOrderRequestDTO);
    }
}
