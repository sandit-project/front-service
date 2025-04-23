package com.example.frontservice.service;

import com.example.frontservice.client.edge.StoreClient;
import com.example.frontservice.dto.store.StoreListRequestDTO;
import com.example.frontservice.dto.store.StoreListResponseDTO;
import com.example.frontservice.dto.store.StoreRequestDTO;
import com.example.frontservice.dto.store.StoreResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@Service
@RequiredArgsConstructor
public class StoreService {

    private final StoreClient storeClient;

    public StoreListResponseDTO getAllStores (StoreListRequestDTO storeListRequestDTO,String token) {

        return storeClient.getStoreList(storeListRequestDTO.getLimit(), storeListRequestDTO.getLastUid(),token);
    }

    public StoreResponseDTO getStore (Long uid,String token) {
        return storeClient.getStore(uid,token);
    }

    public StoreResponseDTO addStore(StoreRequestDTO storeRequestDTO,String token) {
        return storeClient.addStore(storeRequestDTO,token);
    }
    public StoreResponseDTO updateStore(Long uid, StoreRequestDTO storeRequestDTO,String token) {
        return storeClient.updateStore(uid, storeRequestDTO,token);
    }
    public void deleteStore(Long uid,String token) {
        storeClient.deleteStore(uid,token);
    }
    public StoreResponseDTO updateStatusByUid(Long uid,String storeStatus,String token) {
        return storeClient.updateStatusByUid(uid,storeStatus,token);
    }




}
