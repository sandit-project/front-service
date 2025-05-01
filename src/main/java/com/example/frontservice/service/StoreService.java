package com.example.frontservice.service;

import com.example.frontservice.client.edge.StoreClient;
import com.example.frontservice.dto.store.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StoreService {

    private final StoreClient storeClient;

    public StoreListResponseDTO getAllStores (StoreListRequestDTO storeListRequestDTO,String token) {

        return storeClient.getStoreList(storeListRequestDTO.getLimit(), storeListRequestDTO.getLastUid(),token);
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

    public StoreResponseDTO updateStatusByUid(Long storeUid,String storeStatus,String token) {
        return storeClient.updateStatusByUid(storeUid,storeStatus,token);
    }

    public RemoteOrderResponseDTO remoteOrder(String token, String action) {
        return storeClient.remoteOrder(token, action);
    }
}
