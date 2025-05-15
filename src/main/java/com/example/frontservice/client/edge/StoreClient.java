package com.example.frontservice.client.edge;

import com.example.frontservice.dto.store.*;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@FeignClient(name="storeClient", url="${sandit.edge-service-url}/stores")
public interface StoreClient {

    @GetMapping("/list")
    StoreListResponseDTO getStoreList(@RequestParam("limit") int limit,
                                      @RequestParam("lastUid") Long lastUid,
                                      @RequestHeader("Authorization") String token);

    @GetMapping("/{storeUid}")
    StoreResponseDTO getStore(@PathVariable(name="storeUid") Long storeUid,
                              @RequestHeader("Authorization") String token);

    @GetMapping("/storeUid")
    StoreUidResponseDTO getStoreUidByManager(@RequestParam("userUid") Long userUid,
                                            @RequestHeader("Authorization") String token);

    @PostMapping
    StoreResponseDTO addStore(@Valid @RequestBody StoreRequestDTO storeRequestDTO,
                              @RequestHeader("Authorization") String token);



    @PutMapping("/{storeUid}")
    StoreResponseDTO updateStore(@PathVariable(name="storeUid") Long storeUid,
                                 @Valid @RequestBody StoreRequestDTO storeRequestDTO,
                                 @RequestHeader("Authorization") String token);

    @DeleteMapping("/{storeUid}")
    StoreResponseDTO deleteStore(@PathVariable(name="storeUid") Long storeUid,
                                 @RequestHeader("Authorization") String token);

    @GetMapping("/orders/list")
    StoreOrderListResponseDTO getStoreOrderList(@RequestParam("limit") int limit,
                                                @RequestParam("lastUid") Long lastUid,
                                                @RequestHeader("Authorization") String token);

    @PutMapping("/orders/{action}")
    RemoteOrderResponseDTO remoteOrder(@RequestHeader("Authorization") String token,
                                       @PathVariable(name="action") String action,
                                       @RequestBody RemoteOrderRequestDTO remoteOrderRequestDTO);
}
