package com.example.frontservice.client.edge;

import com.example.frontservice.dto.store.*;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@FeignClient(name="storeClient", url="http://localhost:9001")
public interface StoreClient {

    @GetMapping("/stores/list")
    StoreListResponseDTO getStoreList(@RequestParam("limit") int limit,
                                      @RequestParam("lastUid") Long lastUid,
                                      @RequestHeader("Authorization") String token);

    @GetMapping("/stores/{storeUid}")
    StoreResponseDTO getStore(@PathVariable(name="storeUId") Long storeUid,
                              @RequestHeader("Authorization") String token);

    @GetMapping("/stores/storeUid")
    StoreUidResponseDTO getStoreUidByManager(@RequestParam("managerUid") Long managerUid,
                                            @RequestHeader("Authoriztion") String token);

    @PostMapping("/stores")
    StoreResponseDTO addStore(@Valid @RequestBody StoreRequestDTO storeRequestDTO,
                              @RequestHeader("Authorization") String token);



    @PutMapping("/stores/{storeUid}")
    StoreResponseDTO updateStore(@PathVariable(name="storeUid") Long storeUid,
                                 @Valid @RequestBody StoreRequestDTO storeRequestDTO,
                                 @RequestHeader("Authorization") String token);

    @DeleteMapping("/stores/{storeUid}")
    StoreResponseDTO deleteStore(@PathVariable(name="storeUid") Long storeUid,
                                 @RequestHeader("Authorization") String token);

    @PatchMapping("/stores/{storeUid}")
    StoreResponseDTO updateStatusByUid(@PathVariable(name="storeUid") Long storeUid,
                                       @RequestParam("storeStatus") String storeStatus,
                                       @RequestHeader("Authorization") String token);

    @GetMapping("/stores/orders/list")
    StoreOrderListResponseDTO getStoreOrderList(@RequestParam("limit") int limit,
                                                @RequestParam("lastUid") Long lastUid,
                                                @RequestHeader("Authorization") String token);

}
