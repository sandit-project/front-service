package com.example.frontservice.service;

import com.example.frontservice.client.store.StoreClient;
import com.example.frontservice.dto.store.StoreListRequestDTO;
import com.example.frontservice.dto.store.StoreListResponseDTO;
import com.example.frontservice.dto.store.StoreRequestDTO;
import com.example.frontservice.dto.store.StoreResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StoreService {

    private final StoreClient storeClient;

    public StoreListResponseDTO getAllStores (StoreListRequestDTO storeListRequestDTO) {
        return storeClient.getStoreList(storeListRequestDTO);
    }

    public StoreResponseDTO getStore (Long uid) {
        return storeClient.getStore(uid);
    }

    public StoreResponseDTO addStore(StoreRequestDTO storeRequestDTO,String token) {
        return storeClient.addStore(storeRequestDTO,token);
    }
    public StoreResponseDTO updateStore(Long uid, StoreRequestDTO storeRequestDTO) {
        return storeClient.updateStore(uid, storeRequestDTO);
    }
    public void deleteStore(Long uid) {
        storeClient.deleteStore(uid);
    }




}
